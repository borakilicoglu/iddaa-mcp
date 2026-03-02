# Tools

`iddaa-mcp` exposes these MCP tools:

- `get_competitions`
- `get_events`
- `get_detailed_events`
- `get_highlighted_events`

## Notes

- The default filter values are `st=1`, `type=0`, and `version=0`.
- `limit` defaults to `1000` where applicable.

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
