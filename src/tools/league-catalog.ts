export interface LeagueConfig {
  defaultComeback?: boolean
  defaultBaseBet?: number
  id: number
  name: string
  totalWeeks: number
}

export type SupportedLeague
  = | 'Bundesliga'
    | 'Premier League'
    | 'Serie A'
    | 'Super League'
    | 'League 1'
    | 'La Liga'

export const LEAGUE_CATALOG: Record<
  SupportedLeague,
  LeagueConfig
> = {
  'Bundesliga': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70371,
    name: 'Bundesliga',
    totalWeeks: 34,
  },
  'Premier League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70266,
    name: 'Premier League',
    totalWeeks: 38,
  },
  'Serie A': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70184,
    name: 'Serie A',
    totalWeeks: 38,
  },
  'Super League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70381,
    name: 'Super League',
    totalWeeks: 34,
  },
  'League 1': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70351,
    name: 'League 1',
    totalWeeks: 34,
  },
  'La Liga': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70368,
    name: 'La Liga',
    totalWeeks: 38,
  },
}
