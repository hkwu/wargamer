# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

## [0.5.0]
### Added
- Additional options to configure the client's data cache.
- Accounts module for all API clients.

### Changed
- The `cacheTimeToLive` client option now represents the TTL in seconds, not milliseconds.

### Fixed
- Issue with `findVehicleProfile()` not returning `null` when a vehicle ID match is not found.

## [0.4.0] - 2017-01-29
### Added
- Encyclopedia modules for World of Tanks Blitz, World of Tanks Console, World of Warplanes and World of Warships.
- `findVehicleProfile()` method for World of Tanks module.

### Changed
- Removed `options` parameter from module convenience methods.

### Fixed
- Issue with request rejection handler not handling certain types of errors.

## [0.3.1] - 2017-01-22
No changes from previous release. Just a patch for npm.

## [0.3.0] - 2017-01-22
### Added
- Default `language` option for client constructor.
- Client modules.
  - Separate components for each client with convenience methods associated with specific endpoints.
- Caching system for requests.
- More unit tests!

### Changed
- The World of Tanks Console client's factory method on the `Wargamer` class is now `WoTX()` instead of `WoTC()` in order to be consistent with the client slugs. The exported `WorldOfTanksConsole` client class remains the same.
- Changed Webpack's Babel preset setting to >2% usage. Node distribution now builds based on Node v4 compatibility only.
- `APIResponse#response` is now `APIResponse#body`.
- Client methods that weren't entirely asynchronous have been rewritten to be 100% asynchronous.

### Removed
- `APIResponse#url` removed since it's not consistent with SuperAgent's response.

## [0.2.1] - 2017-01-09
### Changed
- Publishing process.

### Removed
- Web distribution from version control. For real this time.

## [0.2.0] - 2017-01-09
### Changed
- `client.fetch()` is now a private method. Requests must now go through `client.get()` or `client.post()`. The `requestMethod` option is no longer available.
- Web distribution: the Wargamer object is now available as `Wargamer` or `window.Wargamer` (the name is capitalized).

### Removed
- Wiped out `.npmignore` in favour of `package.json`.
- Web distribution removed from version control.

## [0.1.2] - 2017-01-04
### Added
- Webpack bundles for the client.

### Fixed
- Undefined property issue in client while handling responses.

## [0.1.1] - 2017-01-03
### Added
- Parameter normalization for request methods.

### Fixed
- Documentation build process for custom domains.
- Missing entries in `.npmignore`.
- Missing environment variables in Travis builds.

## 0.1.0 - 2017-01-02
### Added
- API clients with promise interface for requests.
- Custom wrapper classes for responses and errors.
- Unit tests and continuous integration.
- Documentation build process.

[Unreleased]: https://github.com/hkwu/wargamer/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/hkwu/wargamer/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/hkwu/wargamer/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/hkwu/wargamer/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/hkwu/wargamer/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/hkwu/wargamer/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hkwu/wargamer/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/hkwu/wargamer/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/hkwu/wargamer/compare/v0.1.0...v0.1.1
