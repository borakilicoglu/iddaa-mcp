import type { McpToolContext } from '../../types'
import { fetchJson, sportsbookUrl } from '../../shared/api'
import { formatToolError } from '../../shared/helpers'
import { getDictionary } from '../../shared/i18n'
import { localeSchema } from '../../shared/input-schemas'
import { competitionsResponseSchema } from '../../shared/schemas'

export function registerGetCompetitionsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_competitions',
    'Fetch competitions from Iddaa sportsbook API',
    {
      locale: localeSchema,
    },
    async ({ locale = 'tr' }) => {
      try {
        const dict = getDictionary(locale)
        const { data } = await fetchJson(
          sportsbookUrl('competitions'),
          competitionsResponseSchema,
          'Competitions',
        )
        const soccerData = data.filter(competition => competition.si === '1')

        if (soccerData.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: dict.competitionsNotFound,
              },
            ],
          }
        }

        const formattedCompetitions = soccerData
          .map((competition, index) => {
            const eventCount = competition.ec ?? 0
            return `${index + 1}. ${competition.n} (ID: ${competition.i}, ${dict.competitionEventLabel}: ${eventCount})`
          })
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `${dict.competitionsTitle(soccerData.length)}\n\n${formattedCompetitions}`,
            },
          ],
        }
      }
      catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: formatToolError('get_competitions', error),
            },
          ],
        }
      }
    },
  )
}
