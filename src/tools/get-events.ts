import type { McpToolContext } from '../types'
import { z } from 'zod'
import { sportsbookEventsUrl } from './api'

export function registerGetEventsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_events',
    'Fetch sports events from Iddaa sportsbook API',
    {
      st: z.number().optional().describe('Sport type filter (default: 1)'),
      type: z.number().optional().describe('Event type filter (default: 0)'),
      version: z.number().optional().describe('API version (default: 0)'),
    },
    async ({ st = 1, type = 0, version = 0 }) => {
      try {
        const url = sportsbookEventsUrl({ st, type, version })
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const events = data?.data?.events || []

        if (!Array.isArray(events) || events.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Etkinlik bulunamadı.',
              },
            ],
          }
        }

        const formattedEvents = events
          .map((event: any, index: number) => {
            const date = event?.d
              ? new Date(event.d * 1000).toLocaleString()
              : 'Tarih bilgisi yok'
            return `${index + 1}. ${event.hn} - ${event.an} | Tarih: ${date} | Event ID: ${event.i}`
          })
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `Etkinlikler (${events.length}):\n\n${formattedEvents}`,
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
              text: `Error fetching sports events: ${errorMessage}`,
            },
          ],
        }
      }
    },
  )
}
