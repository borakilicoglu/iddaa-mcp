import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerGetDetailedEventsTool } from './get-detailed-events'
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
})

describe('tools', () => {
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
    expect(result.content[0].text).toContain(
      'Error fetching highlighted matched events:',
    )
  })
})
