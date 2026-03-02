import type { McpToolContext } from '../types'
import { z } from 'zod'
import { fetchJson, sportsbookEventsUrl } from './api'
import { formatToolError } from './helpers'
import { eventsResponseSchema } from './schemas'

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
        const { data } = await fetchJson(
          sportsbookEventsUrl({ st, type, version }),
          eventsResponseSchema,
          'Events',
        )
        const events = data.events

        if (events.length === 0) {
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
          .map((event, index: number) => {
            const date = new Date(event.d * 1000).toLocaleString()
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
        return {
          content: [
            {
              type: 'text',
              text: formatToolError('get_events', error),
            },
          ],
        }
      }
    },
  )
}
