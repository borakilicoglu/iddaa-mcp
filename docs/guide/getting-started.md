# Getting Started

## Install

```bash
npm install -g iddaa-mcp
```

## Run (stdio)

```bash
iddaa-mcp --stdio
```

`--stdio` is optional because stdio is the default mode.

## Cursor config

Add this to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "iddaa-mcp": {
      "command": "npx",
      "args": ["iddaa-mcp", "--stdio"]
    }
  }
}
```

## Language Support

- Default response language is Turkish (`tr`).
- You can set `locale: "en"` in tool arguments for English output.
- Supported values: `tr`, `en`.
