import type { Competition, EventMarket, MarketDefinition } from './schemas'
import type { MatchedEvent } from './types'

export function formatToolError(toolName: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return `[${toolName}] ${message}`
}

export function buildCompetitionMap(competitions: Competition[]): Map<string | number, string> {
  return new Map(competitions.map(competition => [competition.i, competition.n]))
}

export function buildMarketConfigMap(marketConfig: Record<string, MarketDefinition>): Map<string, MarketDefinition> {
  return new Map(Object.entries(marketConfig))
}

export function mapMarketsToOdds(
  markets: EventMarket[],
  marketConfigMap: Map<string, MarketDefinition>,
): MatchedEvent['odds'] {
  return markets.map((market) => {
    const marketKey = `${market.t}_${market.st}`
    const marketConfig = marketConfigMap.get(marketKey)

    if (!marketConfig) {
      return {
        marketName: `Unknown Market (t: ${market.t}, st: ${market.st})`,
        outcomes: market.o.map(outcome => ({
          name: outcome.n,
          odd: outcome.odd,
        })),
      }
    }

    let marketName = marketConfig.n
    if (market.sov !== undefined && marketName.includes('{0}')) {
      marketName = marketName.replace('{0}', String(market.sov))
    }

    return {
      marketName,
      outcomes: market.o.map(outcome => ({
        name: outcome.n,
        odd: outcome.odd,
      })),
    }
  })
}
