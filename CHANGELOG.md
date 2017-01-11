# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- `client.renewAccessToken()` and `client.destroyAccessToken()` as convenience methods for the respective authentication endpoints.

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

[Unreleased]: https://github.com/hkwu/wargamer/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/hkwu/wargamer/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hkwu/wargamer/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/hkwu/wargamer/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/hkwu/wargamer/compare/v0.1.0...v0.1.1
