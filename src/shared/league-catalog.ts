export interface LeagueConfig {
  defaultComeback?: boolean
  defaultBaseBet?: number
  id: number
  name: string
  totalWeeks: number
}

export const LEAGUES = [
  'Bundesliga',
  'Brazilian Serie A',
  'Belgian Pro League',
  'Danish Super League',
  'English Championship',
  'Eredivisie',
  'Premier League',
  'Portuguese Premier League',
  'Scottish Premiership',
  'Serie A',
  'Turkish Super League',
  'Swiss Super League',
  'League 1',
  'La Liga',
] as const

export type SupportedLeague = (typeof LEAGUES)[number]

export const LEAGUE_CATALOG: Record<SupportedLeague, LeagueConfig> = {
  Bundesliga: {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70371,
    name: 'Bundesliga',
    totalWeeks: 34,
  },
  'Brazilian Serie A': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 71950,
    name: 'Brazilian Serie A',
    totalWeeks: 38,
  },
  'Belgian Pro League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70308,
    name: 'Belgian Pro League',
    totalWeeks: 30,
  },
  'Danish Super League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70183,
    name: 'Danish Super League',
    totalWeeks: 22,
  },
  'English Championship': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70340,
    name: 'English Championship',
    totalWeeks: 46,
  },
  Eredivisie: {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70269,
    name: 'Eredivisie',
    totalWeeks: 34,
  },
  'Premier League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70266,
    name: 'Premier League',
    totalWeeks: 38,
  },
  'Portuguese Premier League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70394,
    name: 'Portuguese Premier League',
    totalWeeks: 34,
  },
  'Scottish Premiership': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70290,
    name: 'Scottish Premiership',
    totalWeeks: 33,
  },
  'Serie A': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70184,
    name: 'Serie A',
    totalWeeks: 38,
  },
  'Turkish Super League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70381,
    name: 'Turkish Super League',
    totalWeeks: 34,
  },
  'Swiss Super League': {
    defaultComeback: false,
    defaultBaseBet: 50,
    id: 70309,
    name: 'Swiss Super League',
    totalWeeks: 33,
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
