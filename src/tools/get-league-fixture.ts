import type { McpToolContext } from '../types'
import type { SupportedLeague } from './league-catalog'
import { runInNewContext } from 'node:vm'
import { z } from 'zod'
import { formatToolError } from './helpers'
import { LEAGUE_CATALOG } from './league-catalog'

interface GenericRecord {
  [key: string]: unknown
}

interface NormalizedMatch {
  away: string
  awayGoals: number | null
  date: string
  drawOdd: number | null
  halftimeAwayGoals: number | null
  halftimeHomeGoals: number | null
  home: string
  homeGoals: number | null
  week: number
}

type Strategy = 'none' | 'martingale' | 'fibonacci'

const NULL_PAYLOAD_RETRIES = 4

function getLeagueConfig(league: SupportedLeague) {
  return LEAGUE_CATALOG[league]
}

function buildFixtureUrl(leagueId: number, week: number): string {
  const query = new URLSearchParams({
    command: 'getMatches',
    id: String(leagueId),
    week: String(week),
  })
  return `https://arsiv.mackolik.com/AjaxHandlers/FixtureHandler.aspx?${query.toString()}`
}

async function fetchFixtureRaw(url: string, retries = 0): Promise<string> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! get_league_fixture status: ${response.status}`)
      }

      return await response.text()
    }
    catch (error) {
      lastError = error
    }
  }

  throw lastError
}

async function fetchParsedFixture(url: string, nullRetries = 1): Promise<unknown> {
  let lastError: unknown = new Error('Null payload received from server')

  for (let attempt = 0; attempt <= nullRetries; attempt++) {
    const raw = await fetchFixtureRaw(url, 0)
    const parsed = parsePayload(raw)

    if (parsed !== null) {
      return parsed
    }

    lastError = new Error('Null payload received from server')
  }

  throw lastError
}

function parsePayload(raw: string): unknown {
  const first = parseMaybeJsonOrJsLiteral(raw)

  if (
    first
    && typeof first === 'object'
    && 'd' in first
    && typeof (first as GenericRecord).d === 'string'
  ) {
    return parseMaybeJsonOrJsLiteral((first as GenericRecord).d as string)
  }

  return first
}

function parseMaybeJsonOrJsLiteral(raw: string): unknown {
  try {
    return JSON.parse(raw)
  }
  catch {
    const trimmed = raw.trim()
    if (!(trimmed.startsWith('[') || trimmed.startsWith('{'))) {
      throw new Error('Unsupported payload format')
    }

    // Mackolik archive can return JS array/object literals with single quotes.
    return runInNewContext(`(${trimmed})`, Object.create(null), { timeout: 50 })
  }
}

function findMatchArray(value: unknown, depth = 0): unknown[] {
  if (depth > 5 || value == null) {
    return []
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return []
    }

    const first = value[0]
    if (Array.isArray(first) || (first && typeof first === 'object')) {
      return value
    }
  }

  if (typeof value !== 'object') {
    return []
  }

  for (const inner of Object.values(value as GenericRecord)) {
    const result = findMatchArray(inner, depth + 1)
    if (result.length > 0) {
      return result
    }
  }

  return []
}

function toMatchRecord(row: unknown): GenericRecord {
  if (row && typeof row === 'object' && !Array.isArray(row)) {
    return row as GenericRecord
  }

  if (Array.isArray(row)) {
    return {
      match_id: row[0],
      date: row[1],
      market: row[2],
      home_team_id: row[3],
      home_team: row[4],
      away_team_id: row[5],
      away_team: row[6],
      home_goals: row[9],
      away_goals: row[10],
      odds_home: row[11],
      odds_draw: row[12],
      odds_away: row[13],
      halftime_score: row[23],
    }
  }

  return {}
}

function readFirstString(obj: GenericRecord, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return '-'
}

function readFirstNumber(obj: GenericRecord, keys: string[]): number | null {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null
    }
    if (typeof value === 'string') {
      const normalized = value.replace(',', '.').trim()
      if (normalized.length === 0) {
        continue
      }
      const parsed = Number(normalized)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }
  return null
}

function parseScoreString(
  raw: string | null | undefined,
): { away: number | null, home: number | null } {
  if (!raw) {
    return { home: null, away: null }
  }
  const match = raw.match(/(\d+)\s*[-:]\s*(\d+)/)
  if (!match) {
    return { home: null, away: null }
  }
  return {
    home: Number(match[1]),
    away: Number(match[2]),
  }
}

function readScoreParts(obj: GenericRecord): {
  awayGoals: number | null
  homeGoals: number | null
} {
  const homeGoalsKeys = ['home_goals', 'homeGoals', 'hs', 'hg']
  const awayGoalsKeys = ['away_goals', 'awayGoals', 'as', 'ag']

  return {
    homeGoals: readFirstNumber(obj, homeGoalsKeys),
    awayGoals: readFirstNumber(obj, awayGoalsKeys),
  }
}

function normalizeMatch(match: GenericRecord, week: number): NormalizedMatch {
  const home = readFirstString(match, [
    'home_team',
    'homeTeam',
    'homeTeamName',
    'HomeTeamName',
    'hn',
  ])
  const away = readFirstString(match, [
    'away_team',
    'awayTeam',
    'awayTeamName',
    'AwayTeamName',
    'an',
  ])
  const date = readFirstString(match, ['date', 'match_date', 'd'])
  const drawOdd = readFirstNumber(match, ['odds_draw', 'drawOdd', 'msx', 'x', 'oddX'])
  const { homeGoals, awayGoals } = readScoreParts(match)
  const halftimeScore = readFirstString(match, ['halftime_score', 'halftimeScore', 'iy'])
  const halftimeParts = parseScoreString(halftimeScore === '-' ? undefined : halftimeScore)

  return {
    week,
    date,
    home,
    away,
    homeGoals,
    awayGoals,
    drawOdd,
    halftimeHomeGoals: halftimeParts.home,
    halftimeAwayGoals: halftimeParts.away,
  }
}

function isComebackMatch(match: NormalizedMatch): boolean {
  if (
    match.homeGoals === null
    || match.awayGoals === null
    || match.halftimeHomeGoals === null
    || match.halftimeAwayGoals === null
  ) {
    return false
  }

  const homeLedAtHalf = match.halftimeHomeGoals > match.halftimeAwayGoals
  const awayLedAtHalf = match.halftimeAwayGoals > match.halftimeHomeGoals
  const homeWonAtFull = match.homeGoals > match.awayGoals
  const awayWonAtFull = match.awayGoals > match.homeGoals

  return (homeLedAtHalf && awayWonAtFull) || (awayLedAtHalf && homeWonAtFull)
}

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1
  }
  let a = 1
  let b = 1
  for (let i = 2; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}

function formatAmount(value: number): string {
  return Number(value.toFixed(2)).toString()
}

function simulateStrategy(
  matches: NormalizedMatch[],
  strategy: Exclude<Strategy, 'none'>,
  baseBet: number,
): string {
  let totalBet = 0
  let totalReturn = 0
  let wins = 0
  let losses = 0
  let level = 0
  let currentBet = baseBet

  for (const match of matches) {
    if (match.drawOdd === null || match.drawOdd <= 1) {
      continue
    }
    if (match.homeGoals === null || match.awayGoals === null) {
      continue
    }

    const bet = strategy === 'martingale'
      ? currentBet
      : baseBet * fibonacci(level)
    totalBet += bet

    const isDraw = match.homeGoals === match.awayGoals
    if (isDraw) {
      const payout = bet * match.drawOdd
      totalReturn += payout
      wins += 1
      level = 0
      currentBet = baseBet
    }
    else {
      losses += 1
      level += 1
      if (strategy === 'martingale') {
        currentBet = currentBet * 2
      }
    }
  }

  const netProfit = totalReturn - totalBet
  const roi = totalBet > 0 ? (netProfit / totalBet) * 100 : 0
  return [
    'Strategy Summary:',
    `strategy=${strategy}`,
    `baseBet=${formatAmount(baseBet)}`,
    `totalBet=${formatAmount(totalBet)}`,
    `totalReturn=${formatAmount(totalReturn)}`,
    `netProfit=${formatAmount(netProfit)}`,
    `roi=${formatAmount(roi)}%`,
    `wins=${wins} losses=${losses}`,
  ].join('\n')
}

function formatFixtureText(
  league: SupportedLeague,
  week: number,
  matches: NormalizedMatch[],
  options?: { includeHalftime?: boolean },
): string {
  const title = `${league} | Week ${week} | Match Count: ${matches.length}`
  if (matches.length === 0) {
    return `${title}\n\nNo fixture data found.`
  }

  const lines = matches.map((match, index) => {
    const score = match.homeGoals === null || match.awayGoals === null
      ? '-'
      : `${match.homeGoals}-${match.awayGoals}`
    const drawOdd = match.drawOdd == null ? '-' : String(match.drawOdd)
    const halftime = match.halftimeHomeGoals === null || match.halftimeAwayGoals === null
      ? '-'
      : `${match.halftimeHomeGoals}-${match.halftimeAwayGoals}`
    const halftimeText = options?.includeHalftime ? ` | HT:${halftime}` : ''

    return `${index + 1}. ${match.date} | ${match.home} - ${match.away} | Score: ${score}${halftimeText} | X:${drawOdd}`
  })

  return `${title}\n\n${lines.join('\n')}`
}

export function registerGetLeagueFixtureTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'get_league_fixture',
    'Fetch fixture data for selected leagues from archive source',
    {
      league: z
        .enum([
          'Bundesliga',
          'Premier League',
          'Serie A',
          'Super League',
          'League 1',
          'La Liga',
        ])
        .describe('League name'),
      week: z
        .number()
        .nullable()
        .optional()
        .describe('Week number (if omitted/null: all weeks)'),
      strategy: z
        .enum(['none', 'martingale', 'fibonacci'])
        .optional()
        .describe('Optional draw-betting strategy simulation'),
      baseBet: z.number().optional().describe('Base bet amount'),
      comeback: z
        .boolean()
        .optional()
        .describe('If true, only matches with halftime-leader reversal (1->2, 2->1) are returned'),
    },
    async ({ league, week, strategy, baseBet, comeback }) => {
      try {
        const config = getLeagueConfig(league)
        const selectedComeback = comeback ?? config.defaultComeback ?? false
        if (selectedComeback && strategy && strategy !== 'none') {
          throw new Error('comeback=true cannot be used together with strategy')
        }

        const selectedStrategy = strategy
        const selectedBaseBet = selectedStrategy
          ? (baseBet ?? 50)
          : (baseBet ?? config.defaultBaseBet ?? 50)

        if (selectedStrategy && selectedBaseBet <= 0) {
          throw new Error('baseBet must be greater than 0')
        }

        const normalizedWeek = week ?? undefined

        if (
          normalizedWeek !== undefined
          && (normalizedWeek < 1 || normalizedWeek > config.totalWeeks)
        ) {
          throw new Error(
            `Invalid week. Allowed range for ${league}: 1-${config.totalWeeks}`,
          )
        }

        const weeksToFetch = normalizedWeek !== undefined
          ? [normalizedWeek]
          : Array.from({ length: config.totalWeeks }, (_, i) => i + 1)

        const weekTexts: string[] = []
        const allMatches: NormalizedMatch[] = []
        for (const currentWeek of weeksToFetch) {
          const url = buildFixtureUrl(config.id, currentWeek)
          const parsed = await fetchParsedFixture(url, NULL_PAYLOAD_RETRIES)
          const matches = findMatchArray(parsed).map(toMatchRecord)
          const normalizedMatches = matches.map(match => normalizeMatch(match, currentWeek))
          const filteredMatches = selectedComeback
            ? normalizedMatches.filter(isComebackMatch)
            : normalizedMatches
          allMatches.push(...filteredMatches)
          weekTexts.push(
            formatFixtureText(league, currentWeek, filteredMatches, {
              includeHalftime: selectedComeback,
            }),
          )
        }

        const fixtureText = normalizedWeek !== undefined
          ? weekTexts[0]
          : `${league} | All Weeks | Total Weeks: ${config.totalWeeks}\n\n${weekTexts.join('\n\n')}`
        const strategyText = !selectedStrategy || selectedStrategy === 'none'
          ? ''
          : `\n\n${simulateStrategy(allMatches, selectedStrategy, selectedBaseBet)}`
        const text = `${fixtureText}${strategyText}`

        return {
          content: [
            {
              type: 'text',
              text,
            },
          ],
        }
      }
      catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: formatToolError('get_league_fixture', error),
            },
          ],
        }
      }
    },
  )
}
