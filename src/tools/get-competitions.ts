import type { McpToolContext } from '../types'
import { fetchJson, sportsbookUrl } from './api'
import { formatToolError } from './helpers'
import { competitionsResponseSchema } from './schemas'

export function registerGetCompetitionsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_competitions',
    'Fetch competitions from Iddaa sportsbook API',
    {},
    async () => {
      try {
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
                text: 'Müsabaka bulunamadı.',
              },
            ],
          }
        }

        const formattedCompetitions = soccerData
          .map((competition, index) => {
            const eventCount = competition.ec ?? 0
            return `${index + 1}. ${competition.n} (ID: ${competition.i}, Etkinlik: ${eventCount})`
          })
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `Müsabakalar (${soccerData.length}):\n\n${formattedCompetitions}`,
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
