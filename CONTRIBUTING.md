# Contributing

Thanks for contributing to `iddaa-mcp`.

This project is a focused MCP server for iddaa sportsbook data. Contributions should keep the tool surface stable, documentation accurate, and releases easy to cut.

## Before You Start

- Node.js `18+` is required.
- Use `pnpm` as the package manager.
- Check existing docs before changing tool names, arguments, defaults, transport behavior, or supported league/locale lists.

Install dependencies:

```bash
pnpm install
```

## Local Development

Common commands:

```bash
pnpm build
pnpm typecheck
pnpm test:ci
```

Useful development commands:

```bash
pnpm dev-stdio
pnpm dev-http
pnpm docs:dev
```

## Project Expectations

- Keep changes small and focused.
- Prefer clear, minimal changes over broad refactors.
- Preserve the existing MCP tool contract unless the change is intentional.
- If behavior changes, update user-facing docs in the same change.

## Code and Docs Checklist

Before opening or merging a change, make sure:

1. `pnpm test:ci` passes.
2. `pnpm typecheck` passes.
3. `pnpm build` succeeds.
4. `README.md` and `docs/` are updated when relevant.
5. `CHANGELOG.md` is updated for release-facing changes.

Update docs whenever any of these change:

- Tool names or arguments
- Default values
- Transport behavior
- Supported league lists
- Supported locale lists

For league fixture changes, keep the source of truth aligned with `src/shared/league-catalog.ts`.

## Commit Guidelines

Use Conventional Commits:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `chore: ...`

If a change is breaking, call it out clearly in the commit body or PR description.

## Pull Requests

A good PR should include:

- A short explanation of what changed
- Why the change was needed
- Any tool, transport, or schema impact
- Doc updates when behavior changed
- Changelog updates when preparing a release-facing change

If you changed MCP tool inputs or outputs, include a short example in the PR description.

## Release Notes

When preparing a release:

1. Bump the version in `package.json`.
2. Add matching release notes to `CHANGELOG.md`.
3. Verify `pnpm test:ci`, `pnpm typecheck`, and `pnpm build`.
4. Create a release commit such as `chore: release v0.1.8`.
5. Tag the release as `v0.1.8`.
6. Push `main` and the tag.

Publishing is automated by `.github/workflows/publish.yml`. A pushed `v*` tag triggers the npm publish workflow. Do not assume the package is live until the GitHub Actions workflow succeeds.

GitHub release example:

```bash
gh release create v0.1.8 --title "v0.1.8" --notes "..."
```

## Scope

`AGENTS.md` defines contributor workflow and release expectations. It is not runtime configuration and does not change application behavior.
