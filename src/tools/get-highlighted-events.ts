import type { McpToolContext } from '../types'
import type { MarketDefinition, MatchedEvent } from './types'
import { z } from 'zod'

export function registerGetHighlightedEventsTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_highlighted_events',
    'Fetch highlighted events',
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
        const [
          highlightsResponse,
          eventsResponse,
          competitionsResponse,
          marketConfigResponse,
        ] = await Promise.all([
          fetch(
            `https://sportsbookv2.iddaa.com/sportsbook/highlighted-events?st=${st}&type=${type}&version=${version}`,
          ),
          fetch(
            `https://sportsbookv2.iddaa.com/sportsbook/events?st=${st}&type=${type}&version=${version}`,
          ),
          fetch('https://sportsbookv2.iddaa.com/sportsbook/competitions'),
          fetch('https://sportsbookv2.iddaa.com/sportsbook/get_market_config'),
        ])

        if (
          !highlightsResponse.ok
          || !eventsResponse.ok
          || !competitionsResponse.ok
          || !marketConfigResponse.ok
        ) {
          throw new Error(
            `HTTP error! Highlights: ${highlightsResponse.status}, Events: ${eventsResponse.status}, Competitions: ${competitionsResponse.status}, MarketConfig: ${marketConfigResponse.status}`,
          )
        }

        const highlightsData = await highlightsResponse.json()
        const eventsData = await eventsResponse.json()
        const competitionsData = await competitionsResponse.json()
        const marketConfigData = await marketConfigResponse.json()

        const highlightedEventIds = new Set()
        const highlights = highlightsData?.data?.he || []
        if (Array.isArray(highlights)) {
          highlights.forEach((eventId) => {
            highlightedEventIds.add(eventId)
          })
        }

        const competitionMap = new Map()
        const competitions = competitionsData?.data || []
        if (Array.isArray(competitions)) {
          competitions.forEach((competition) => {
            competitionMap.set(competition.i, competition.n)
          })
        }

        const marketConfigMap = new Map(
          Object.entries(marketConfigData?.data?.m || {}),
        )

        const matchedEvents: MatchedEvent[] = []
        const events = eventsData?.data?.events || []
        if (Array.isArray(events)) {
          events
            .filter(event => highlightedEventIds.has(event.i))
            .slice(0, limit)
            .forEach((event) => {
              const competitionName
                = competitionMap.get(event.ci) || 'Unknown Competition'

              const odds = (event.m || []).map((market: any) => {
                const marketKey = `${market.t}_${market.st}`
                const marketConfig = marketConfigMap.get(marketKey) as
                  | MarketDefinition
                  | undefined

                if (!marketConfig) {
                  return {
                    marketName: `Unknown Market (t: ${market.t}, st: ${market.st})`,
                    outcomes: market.o,
                  }
                }

                let marketName = marketConfig.n
                if (market.sov !== undefined && marketName.includes('{0}')) {
                  marketName = marketName.replace('{0}', market.sov)
                }

                return {
                  marketName,
                  outcomes: (market.o || []).map((outcome: any) => ({
                    name: outcome.n,
                    odd: outcome.odd,
                  })),
                }
              })

              matchedEvents.push({
                eventId: event.i,
                competitionId: event.ci,
                hn: event.hn,
                an: event.an,
                mbc: event.mbc,
                competition: competitionName,
                date: new Date(event.d * 1000).toLocaleString(),
                odds,
              })
            })
        }

        if (matchedEvents.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Öne çıkan etkinlik bulunamadı.',
              },
            ],
          }
        }

        const formattedEvents = matchedEvents
          .map((event, index) => {
            const marketPreview = (event.odds || [])
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
              marketPreview
                ? `Oranlar:\n${marketPreview}`
                : 'Oran bilgisi yok.',
            ].join('\n')
          })
          .join('\n\n')

        return {
          content: [
            {
              type: 'text',
              text: `Öne çıkan etkinlikler (${matchedEvents.length}):\n\n${formattedEvents}`,
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
              text: `Error fetching highlighted matched events: ${errorMessage}`,
            },
          ],
        }
      }
    },
  )
}
