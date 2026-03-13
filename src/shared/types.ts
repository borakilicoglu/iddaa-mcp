export interface MatchedEvent {
  eventId?: number
  competitionId?: number
  hn: string
  an: string
  mbc: number
  competition: string
  date: string
  odds: {
    marketName: string
    outcomes: {
      name: string
      odd: number
    }[]
  }[]
}

export interface MarketDefinition {
  i: number
  n: string
  d: string
  il: boolean
  mt: number
  mmdv: number
  mmlv: number
  p: number
  st: number
  mst: number
  mdv: number
  mlv: number
  in: boolean
  o?: { [key: string]: string }
}
