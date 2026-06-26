# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2026-06-07

### Changed
- Maintenance: dependency vulnerability fixes and standardized MIT license.

## [3.0.0] - 2026-05-21

### Added
- `computed()` derived values, `classList` binding, `detach()`, and scheduler seams.

## [2.0.0] - 2026-05-19

This line completed the vanilla-JS rewrite (the untagged v1.x work) and shipped breaking API changes.

### Added
- Complete rewrite as a vanilla-JS reactive engine.
- `resource()` for async state management, with `stop()` to honor the cleanup contract.

### Changed
- `text()` is now the canonical API, with `bind()` as a direct alias.
- `style()` now removes properties dropped between renders.

## [0.3.1] - 2024-04-03

Earlier API line, before the vanilla-JS rewrite.

### Added
- Initial reactive primitives with key-on-create and a simplified, flexible API.
