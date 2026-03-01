import type { z } from 'zod'

const SPORTSBOOK_BASE_URL = 'https://sportsbookv2.iddaa.com/sportsbook'
const responseCache = new Map<string, { expiresAt: number, value: unknown }>()

export function clearResponseCache(): void {
  responseCache.clear()
}

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

export async function fetchJson<TSchema extends z.ZodTypeAny>(
  url: string,
  schema: TSchema,
  source: string,
): Promise<z.infer<TSchema>> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP error! ${source} status: ${response.status}`)
  }

  const json = await response.json()
  return schema.parse(json)
}

export async function fetchJsonCached<TSchema extends z.ZodTypeAny>(
  url: string,
  schema: TSchema,
  source: string,
  ttlMs: number,
): Promise<z.infer<TSchema>> {
  const now = Date.now()
  const cached = responseCache.get(url)

  if (cached && cached.expiresAt > now) {
    return schema.parse(cached.value)
  }

  const value = await fetchJson(url, schema, source)
  responseCache.set(url, { expiresAt: now + ttlMs, value })
  return value
}
