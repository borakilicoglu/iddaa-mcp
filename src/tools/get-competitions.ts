import type { McpToolContext } from '../types'
import { sportsbookUrl } from './api'

export function registerGetCompetitionsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_competitions',
    'Fetch competitions from Iddaa sportsbook API',
    {},
    async () => {
      try {
        const url = sportsbookUrl('competitions')
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { data } = await response.json()
        const soccerData = data.filter((competition: any) => {
          return competition.si === '1'
        })

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
          .map((competition: any, index: number) => {
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
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching competitions: ${errorMessage}`,
            },
          ],
        }
      }
    },
  )
}
