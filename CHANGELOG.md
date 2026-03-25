# Changelog

All notable changes to this project will be documented in this file.

## [0.1.16] - 2026-03-25

### Added

- Leagues: `2. Bundesliga` (`id: 70372`, `totalWeeks: 34`) for `get_league_fixture`.

## [0.1.15] - 2026-03-24

### Added

- Leagues: `Austrian Bundesliga` (`id: 70373`, `totalWeeks: 22`) for `get_league_fixture`.

## [0.1.14] - 2026-03-23

### Added

- Leagues: `Danish Super League` (`id: 70183`, `totalWeeks: 22`) for `get_league_fixture`.

### Changed

- Docs: updated README and tools guide supported league lists for `get_league_fixture`.

## [0.1.13] - 2026-03-20

### Added

- Leagues: `English Championship` (`id: 70340`, `totalWeeks: 46`) for `get_league_fixture`.

### Changed

- README: added a `license` badge to the centered badge row.

## [0.1.12] - 2026-03-20

### Added

- Leagues: `Scottish Premiership` (`id: 70290`, `totalWeeks: 33`) for `get_league_fixture`.

### Changed

- README: centered the badge row and cover image, and removed the top-level `iddaa-mcp` title.

## [0.1.11] - 2026-03-20

### Added

- Leagues: `Brazilian Serie A` (`id: 71950`, `totalWeeks: 38`) for `get_league_fixture`.

### Changed

- README: npm downloads badge now uses total downloads (`dt`) instead of weekly downloads (`dw`).
- Docs: `get_league_fixture` examples now use `Bundesliga` as the default example league.

## [0.1.10] - 2026-03-14

### Added

- Leagues: `Belgian Pro League` (`id: 70308`, `totalWeeks: 30`) for `get_league_fixture`.

### Changed

- Localization: improved English output for `get_highlighted_events` and `get_detailed_events` by translating common Turkish league/market labels in response text.
- Code quality: fixed feature-module import paths/order and lint issues after `features/shared` refactor.
- Tests: fixed typing issue in fixture catalog-id assertions (`fetchMock` call argument typing).

## [0.1.9] - 2026-03-13

### Changed

- Project structure: moved tool implementations from `src/tools` into feature-based modules under `src/features/*`.
- Shared infrastructure: moved common API, schemas, i18n, helpers, and catalog/types into `src/shared/*`.
- Tool registration: moved registry to `src/features/register-tools.ts` and updated CLI wiring.
- Tests: moved tool test suite to `src/features/tools.test.ts`.
- Package metadata: replaced `contributors` with npm-standard `author` field.
- Docs: updated path references from `src/tools/*` to `src/shared/*`.

## [0.1.8] - 2026-03-11

### Changed

- `get_league_fixture`: use centralized `LEAGUES` catalog constant for input validation to keep schema and catalog in sync.
- Project scripts: remove deprecated `scripts/release.ts` and `release` npm script.
- Docs: clarify league source of truth in README and tools guide.

## [0.1.7] - 2026-03-11

### Added

- Leagues: `Portuguese Premier League`.

## [0.1.6] - 2026-03-11

### Added

- Leagues: `Eredivisie`, `Swiss Super League`.

### Changed

- League naming: `Super League` is now `Turkish Super League` (breaking change for tool args).
- README: add npm/version/downloads and bundle size badges.

## [0.1.5] - 2026-03-11

### Added

- `get_league_fixture`: `locale` parameter (`tr` default, `en` supported) with localized fixture and strategy summary output.

### Changed

- Docs: document `locale` and update docs cover/copy.
