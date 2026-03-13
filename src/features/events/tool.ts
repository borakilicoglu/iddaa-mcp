import type { McpToolContext } from '../types'
import { fetchJson, sportsbookEventsUrl } from '../../shared/api'
import { formatToolError } from '../../shared/helpers'
import { formatUnixDate, getDictionary } from '../../shared/i18n'
import { localeSchema, sportsbookFilterSchemas } from '../../shared/input-schemas'
import { eventsResponseSchema } from '../../shared/schemas'

export function registerGetEventsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_events',
    'Fetch sports events from Iddaa sportsbook API',
    {
      ...sportsbookFilterSchemas,
      locale: localeSchema,
    },
    async ({ st = 1, type = 0, version = 0, locale = 'tr' }) => {
      try {
        const dict = getDictionary(locale)
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
                text: dict.eventsNotFound,
              },
            ],
          }
        }

        const formattedEvents = events
          .map((event, index: number) => {
            const date = formatUnixDate(event.d, locale)
            return `${index + 1}. ${event.hn} - ${event.an} | ${dict.dateLabel}: ${date} | Event ID: ${event.i}`
          })
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `${dict.eventsTitle(events.length)}\n\n${formattedEvents}`,
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
