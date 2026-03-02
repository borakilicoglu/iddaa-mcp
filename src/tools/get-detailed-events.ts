import type { McpToolContext } from '../types'
import type { MatchedEvent } from './types'
import { z } from 'zod'
import { fetchJson, fetchJsonCached, sportsbookEventsUrl, sportsbookUrl } from './api'
import {
  buildCompetitionMap,
  buildMarketConfigMap,
  formatToolError,
  mapMarketsToOdds,
} from './helpers'
import {
  competitionsResponseSchema,
  eventsResponseSchema,
  marketConfigResponseSchema,
} from './schemas'

const REFERENCE_CACHE_TTL_MS = 60_000

export function registerGetDetailedEventsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_detailed_events',
    'Fetch events with matched organization names and competition details',
    {
      st: z.number().optional().describe('Sport type filter (default: 1)'),
      type: z.number().optional().describe('Event type filter (default: 0)'),
      version: z.number().optional().describe('API version (default: 0)'),
      limit: z
        .number()
        .optional()
        .describe('Limit number of results (default: 1000)'),
    },
    async ({ st = 1, type = 0, version = 0, limit = 1000 }) => {
      try {
        const [eventsData, competitionsData, marketConfigData] = await Promise.all([
          fetchJson(
            sportsbookEventsUrl({ st, type, version }),
            eventsResponseSchema,
            'Events',
          ),
          fetchJsonCached(
            sportsbookUrl('competitions'),
            competitionsResponseSchema,
            'Competitions',
            REFERENCE_CACHE_TTL_MS,
          ),
          fetchJsonCached(
            sportsbookUrl('get_market_config'),
            marketConfigResponseSchema,
            'MarketConfig',
            REFERENCE_CACHE_TTL_MS,
          ),
        ])

        const competitionMap = buildCompetitionMap(competitionsData.data)
        const marketConfigMap = buildMarketConfigMap(marketConfigData.data.m)

        const matchedEvents: MatchedEvent[] = []
        eventsData.data.events.slice(0, limit).forEach((event) => {
          const competitionName
            = competitionMap.get(event.ci) || 'Unknown Competition'

          const odds = mapMarketsToOdds(event.m, marketConfigMap)

          matchedEvents.push({
            hn: event.hn,
            an: event.an,
            mbc: event.mbc,
            competition: competitionName,
            date: new Date(event.d * 1000).toLocaleString(),
            odds,
          })
        })

        if (matchedEvents.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Etkinlik bulunamadı.',
              },
            ],
          }
        }

        const formattedEvents = matchedEvents
          .map((event, index) => {
            const oddsText = (event.odds || [])
              .map((market: MatchedEvent['odds'][number]) => {
                const outcomes = (market.outcomes || [])
                  .map(
                    (
                      outcome: MatchedEvent['odds'][number]['outcomes'][number],
                    ) => `${outcome.name}: ${outcome.odd}`,
                  )
                  .join(', ')
                return `- ${market.marketName}${outcomes ? ` (${outcomes})` : ''}`
              })
              .join('\n')

            return [
              `${index + 1}. ${event.hn} - ${event.an}`,
              `Lig: ${event.competition}`,
              `Tarih: ${event.date}`,
              oddsText ? `Oranlar:\n${oddsText}` : 'Oran bilgisi yok.',
            ].join('\n')
          })
          .join('\n\n')

        return {
          content: [
            {
              type: 'text',
              text: `Etkinlikler (${matchedEvents.length}):\n\n${formattedEvents}`,
            },
          ],
        }
      }
      catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: formatToolError('get_detailed_events', error),
            },
          ],
        }
      }
    },
  )
}
