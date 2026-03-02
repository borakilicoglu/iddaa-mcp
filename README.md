# iddaa-mcp

![iddaa-mcp cover](./public/cover.svg)

`iddaa-mcp` gives you a focused MCP integration for iddaa sportsbook data with local and remote transport support.

Documentation site: https://borakilicoglu.github.io/iddaa-mcp/

## npm Package

This project is published on npm as [`iddaa-mcp`](https://www.npmjs.com/package/iddaa-mcp).

Install it with:

```bash
npm install -g iddaa-mcp
```

## Features

- `iddaa` data tools ready to use:
  - `get_competitions`
  - `get_events`
  - `get_detailed_events`
  - `get_highlighted_events`
- Multiple transport support:
  - `stdio` (default, local development)
  - `http` (`/mcp` endpoint for remote/local clients)
  - `sse` (deprecated)
- Type-safe tool schemas with `zod`.
- MCP client integration via `.cursor/mcp.json`.
- Build and runtime flow with `pnpm`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Specify version if necessary)
- An MCP-compatible client (e.g., [Cursor](https://cursor.com/))

## Usage

### Supported Transport Options

Model Context Protocol Supports multiple Transport methods.

### stdio

Recommend for local setups

#### Code Editor Support

Add the code snippets below

- Cursor: `.cursor/mcp.json`

**Local development/testing**

Use this if you want to test your mcp server locally

```json
{
  "mcpServers": {
    "iddaa-mcp-stdio": {
      "command": "node",
      "args": ["./bin/cli.mjs", "--stdio"]
    }
  }
}
```

**Published Package**

Use this when you have published your package in the npm registry

```json
{
  "mcpServers": {
    "iddaa-mcp-stdio": {
      "command": "npx",
      "args": ["iddaa-mcp", "--stdio"]
    }
  }
}
```

### Streamable HTTP

> Important: Streamable HTTP is not supported in Cursor yet

Recommend for remote server usage

**Important:** In contrast to stdio you need also to run the server with the correct flag

**Local development**
Use the `streamable http` transport

1. Start the MCP Server
   Run this in your terminal

```bash
node ./bin/cli.mjs --http --port 4200
```

Or with mcp inspector

```bash
pnpm run dev-http
# pnpm run dev-sse (deprecated)
```

2. Add this to your config

```json
{
  "mcpServers": {
    "iddaa-mcp-http": {
      "command": "node",
      "args": ["./bin/cli.mjs", "--http", "--port", "4001"]
      // "args": ["./bin/cli.mjs", "--sse", "--port", "4002"] (or deprecated sse usage)
    }
  }
}
```

**Published Package**

Use this when you have published your package in the npm registry

Run this in your terminal

```bash
npx iddaa-mcp --http --port 4200
# npx iddaa-mcp --sse --port 4201 (deprecated)
```

```json
{
  "mcpServers": {
    "iddaa-mcp-http": {
      "url": "http://localhost:4200/mcp"
      // "url": "http://localhost:4201/sse"
    }
  }
}
```

## Use the Inspector

Use the `inspect` command to debug your mcp server

## Command-Line Options

### Protocol Selection

| Protocol | Description        | Flags                                                         | Notes      |
| :------- | :----------------- | :------------------------------------------------------------ | :--------- |
| `stdio`  | Standard I/O       | (None)                                                        | Default    |
| `http`   | HTTP REST          | `--port <num>` (def: 3000), `--endpoint <path>` (def: `/mcp`) |            |
| `sse`    | Server-Sent Events | `--port <num>` (def: 3000)                                    | Deprecated |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
