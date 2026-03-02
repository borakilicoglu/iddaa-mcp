import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearResponseCache } from './api'
import { registerGetCompetitionsTool } from './get-competitions'
import { registerGetDetailedEventsTool } from './get-detailed-events'
import { registerGetEventsTool } from './get-events'
import { registerGetHighlightedEventsTool } from './get-highlighted-events'

type ToolHandler = (args: Record<string, unknown>) => Promise<any>

function createMockMcp() {
  const handlers = new Map<string, ToolHandler>()
  return {
    mcp: {
      tool: (
        name: string,
        _description: string,
        _schema: Record<string, unknown>,
        handler: ToolHandler,
      ) => {
        handlers.set(name, handler)
      },
    },
    getHandler(name: string) {
      const handler = handlers.get(name)
      if (!handler) {
        throw new Error(`Tool handler not found: ${name}`)
      }
      return handler
    },
  }
}

function okJson(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearResponseCache()
})

describe('tools', () => {
  it('get_competitions supports English locale', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetCompetitionsTool({ mcp } as any)
    const handler = getHandler('get_competitions')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 1, n: 'Super Lig', si: '1', ec: 3 }] })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({ locale: 'en' })
    expect(result.content[0].text).toContain('Competitions (1):')
    expect(result.content[0].text).toContain('Events: 3')
  })

  it('get_events supports English locale', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetEventsTool({ mcp } as any)
    const handler = getHandler('get_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [],
              }],
            },
          })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({ locale: 'en' })
    expect(result.content[0].text).toContain('Events (1):')
    expect(result.content[0].text).toContain('Date:')
  })

  it('get_detailed_events uses default limit=1000', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    const events = Array.from({ length: 1100 }, (_, i) => ({
      i: i + 1,
      ci: 'league-1',
      hn: `Home ${i + 1}`,
      an: `Away ${i + 1}`,
      mbc: 0,
      d: 1_700_000_000,
      m: [],
    }))

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/sportsbook/events?')) {
        return okJson({ data: { events } })
      }
      if (url.endsWith('/sportsbook/competitions')) {
        return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
      }
      if (url.endsWith('/sportsbook/get_market_config')) {
        return okJson({ data: { m: {} } })
      }
      throw new Error(`Unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await handler({})
    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toContain('Etkinlikler (1000):')
  })

  it('get_detailed_events applies explicit limit', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    const events = Array.from({ length: 10 }, (_, i) => ({
      i: i + 1,
      ci: 'league-1',
      hn: `H${i + 1}`,
      an: `A${i + 1}`,
      mbc: 0,
      d: 1_700_000_000,
      m: [],
    }))

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({ data: { events } })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({ limit: 2 })
    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toContain('Etkinlikler (2):')
  })

  it('get_detailed_events supports English locale', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [],
              }],
            },
          })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({ locale: 'en' })
    expect(result.content[0].text).toContain('Events (1):')
    expect(result.content[0].text).toContain('League:')
    expect(result.content[0].text).toContain('Date:')
    expect(result.content[0].text).toContain('No odds data.')
  })

  it('get_highlighted_events uses default limit=1000', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetHighlightedEventsTool({ mcp } as any)
    const handler = getHandler('get_highlighted_events')

    const events = Array.from({ length: 1100 }, (_, i) => ({
      i: i + 1,
      ci: 'league-1',
      hn: `Home ${i + 1}`,
      an: `Away ${i + 1}`,
      mbc: 0,
      d: 1_700_000_000,
      m: [],
    }))

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/highlighted-events?')) {
          return okJson({ data: { he: events.map(e => e.i) } })
        }
        if (url.includes('/sportsbook/events?')) {
          return okJson({ data: { events } })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({})
    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toContain('Öne çıkan etkinlikler (1000):')
  })

  it('get_highlighted_events returns error text when upstream fails', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetHighlightedEventsTool({ mcp } as any)
    const handler = getHandler('get_highlighted_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      })),
    )

    const result = await handler({})
    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toContain('[get_highlighted_events]')
  })

  it('get_detailed_events returns no events text when limit=0', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [],
              }],
            },
          })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({ limit: 0 })
    expect(result.content[0].text).toContain('Etkinlik bulunamadı.')
  })

  it('get_detailed_events handles missing market config with localized fallback', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [{
                  t: 99,
                  st: 88,
                  o: [{ n: 'X', odd: 2.5 }],
                }],
              }],
            },
          })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({})
    expect(result.content[0].text).toContain('Bilinmeyen Market (t: 99, st: 88)')
  })

  it('get_highlighted_events returns no highlights text for empty he', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetHighlightedEventsTool({ mcp } as any)
    const handler = getHandler('get_highlighted_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/highlighted-events?')) {
          return okJson({ data: { he: [] } })
        }
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [],
              }],
            },
          })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({})
    expect(result.content[0].text).toContain('Öne çıkan etkinlik bulunamadı.')
  })

  it('get_highlighted_events tolerates incomplete market config entries', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetHighlightedEventsTool({ mcp } as any)
    const handler = getHandler('get_highlighted_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/highlighted-events?')) {
          return okJson({ data: { he: [1] } })
        }
        if (url.includes('/sportsbook/events?')) {
          return okJson({
            data: {
              events: [{
                i: 1,
                ci: 'league-1',
                hn: 'Home',
                an: 'Away',
                mbc: 0,
                d: 1_700_000_000,
                m: [{
                  t: 2,
                  st: 821,
                  o: [{ n: '1', odd: 1.8 }],
                }],
              }],
            },
          })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({
            data: {
              m: {
                // Upstream can omit several fields such as "d" and "in".
                '2_821': {
                  n: 'Match Result',
                },
              },
            },
          })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({})
    expect(result.content[0].text).toContain('Öne çıkan etkinlikler (1):')
    expect(result.content[0].text).toContain('Match Result')
  })

  it('get_detailed_events returns standardized error on schema mismatch', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/sportsbook/events?')) {
          return okJson({ data: { events: [{ invalid: true }] } })
        }
        if (url.endsWith('/sportsbook/competitions')) {
          return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
        }
        if (url.endsWith('/sportsbook/get_market_config')) {
          return okJson({ data: { m: {} } })
        }
        throw new Error(`Unexpected URL: ${url}`)
      }),
    )

    const result = await handler({})
    expect(result.content[0].text).toContain('[get_detailed_events]')
  })

  it('reuses cached competitions and market config between calls', async () => {
    const { mcp, getHandler } = createMockMcp()
    registerGetDetailedEventsTool({ mcp } as any)
    const handler = getHandler('get_detailed_events')

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/sportsbook/events?')) {
        return okJson({
          data: {
            events: [{
              i: 1,
              ci: 'league-1',
              hn: 'Home',
              an: 'Away',
              mbc: 0,
              d: 1_700_000_000,
              m: [],
            }],
          },
        })
      }
      if (url.endsWith('/sportsbook/competitions')) {
        return okJson({ data: [{ i: 'league-1', n: 'League 1' }] })
      }
      if (url.endsWith('/sportsbook/get_market_config')) {
        return okJson({ data: { m: {} } })
      }
      throw new Error(`Unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    await handler({})
    await handler({})

    const competitionsCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith('/sportsbook/competitions'),
    )
    const marketConfigCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith('/sportsbook/get_market_config'),
    )

    expect(competitionsCalls).toHaveLength(1)
    expect(marketConfigCalls).toHaveLength(1)
  })
})
