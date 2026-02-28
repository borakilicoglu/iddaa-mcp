const SPORTSBOOK_BASE_URL = 'https://sportsbookv2.iddaa.com/sportsbook'

export function sportsbookUrl(path: string): string {
  return `${SPORTSBOOK_BASE_URL}/${path}`
}

export function sportsbookEventsUrl(params: {
  st: number
  type: number
  version: number
}): string {
  const query = new URLSearchParams({
    st: String(params.st),
    type: String(params.type),
    version: String(params.version),
  })
  return sportsbookUrl(`events?${query.toString()}`)
}
