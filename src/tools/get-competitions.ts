import type { McpToolContext } from '../types'
import { z } from 'zod'
import { fetchJson, sportsbookUrl } from './api'
import { formatToolError } from './helpers'
import { getDictionary } from './i18n'
import { competitionsResponseSchema } from './schemas'

export function registerGetCompetitionsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_competitions',
    'Fetch competitions from Iddaa sportsbook API',
    {
      locale: z
        .enum(['tr', 'en'])
        .optional()
        .default('tr')
        .describe('Language for response text (default: tr)'),
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
