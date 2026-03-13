# AGENTS.md

This file defines the working protocol for human/agent contributors in the `iddaa-mcp` repository.

## Purpose

- Keep changes consistent, tested, and releasable
- Keep documentation and changelog in sync with code updates
- Standardize the release workflow

## Project Context

- Repository: `iddaa-mcp`
- Runtime: Node.js 18+
- Package manager: `pnpm`
- Main commands:
  - `pnpm test:ci`
  - `pnpm typecheck`
  - `pnpm build`

## Working Rules

- Keep commits small and focused.
- Use Conventional Commits:
  - `feat: ...`
  - `fix: ...`
  - `docs: ...`
  - `chore: ...`
- For breaking changes, clearly state them in the commit body or PR description.

## Code Change Checklist

Before cutting a release, ensure:

1. `pnpm test:ci` passes
2. `pnpm typecheck` passes
3. Update `README.md` and `docs/` when needed
4. `CHANGELOG.md` includes the new release notes

## Versioning and Release

- Bump version in `package.json` (`x.y.z`).
- Update `CHANGELOG.md` for the same version.
- Example release commit:
  - `chore: release v0.1.8`
- Tag format:
  - `v0.1.8`
- Create GitHub release with `gh`:
  - `gh release create v0.1.8 --title "v0.1.8" --notes "..."`
- After release:
  - `main` and the tag must be pushed to remote.

## Documentation Policy

If any of the following changes, docs must be updated:

- Tool names/arguments
- Default values
- Transport behavior
- Supported league/locale lists

## Out of Scope

- AGENTS.md is not a runtime configuration file.
- It does not change application behavior; it defines contributor workflow only.
