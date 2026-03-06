# Tools

`iddaa-mcp` exposes these MCP tools:

- `get_competitions`
- `get_events`
- `get_detailed_events`
- `get_highlighted_events`
- `get_league_fixture`

## Notes

- The default filter values are `st=1`, `type=0`, and `version=0`.
- `limit` defaults to `1000` where applicable.
- `get_league_fixture` reads league `id` and `totalWeeks` from:
  - `src/tools/league-catalog.ts`

## `get_league_fixture` Parameters

- `league` (required):
  - `Bundesliga`
  - `Premier League`
  - `Serie A`
  - `Super League`
  - `League 1`
  - `La Liga`
- `week` (optional, nullable):
  - If provided, fetches only that week.
  - If omitted or `null`, fetches all weeks (`1..totalWeeks`).
- `strategy` (optional):
  - `martingale` | `fibonacci` | `none`
  - If omitted, no strategy summary is returned.
- `baseBet` (optional):
  - Used only when `strategy` is provided.
  - Defaults to `50` when `strategy` exists and `baseBet` is omitted.
- `comeback` (optional):
  - `true` | `false`
  - If `true`, only halftime-leader reversals are returned (`1->2`, `2->1`).

## `get_league_fixture` Runtime Notes

- Server `null` payload retry:
  - The tool retries the same request up to `4` times when payload is `null`.
- Parameter compatibility:
  - `comeback=true` cannot be used with `strategy=martingale|fibonacci`.
- Output:
  - Fixture text is always returned.
  - `Strategy Summary` is appended only when `strategy` is set (and not `none`).

## Language Support

- Default response language is Turkish (`tr`).
- You can set `locale: "en"` in tool arguments for English output.
- Supported values: `tr`, `en`.

Example:

```json
{
  "tool": "get_highlighted_events",
  "arguments": {
    "limit": 5,
    "locale": "en"
  }
}
```

`get_league_fixture` example:

```json
{
  "tool": "get_league_fixture",
  "arguments": {
    "league": "Super League",
    "strategy": "martingale"
  }
}
```

`get_league_fixture` comeback example:

```json
{
  "tool": "get_league_fixture",
  "arguments": {
    "league": "Super League",
    "comeback": true
  }
}
```
