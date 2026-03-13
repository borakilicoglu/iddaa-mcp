# Changelog

All notable changes to this project will be documented in this file.

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
