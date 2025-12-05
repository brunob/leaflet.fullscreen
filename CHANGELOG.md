# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [5.1.1](https://github.com/brunob/leaflet.fullscreen/compare/v5.1.0...v5.1.1) (2025-12-05)


### Bug Fixes

* **build:** simplify UMD global to L.Control.FullScreen ([b3ef3f9](https://github.com/brunob/leaflet.fullscreen/commit/b3ef3f99021a0d3b023660e278f65aaef61178ec))
* **scripts:** move `git push` to `prepublishOnly` to fix double invocation ([fb0792c](https://github.com/brunob/leaflet.fullscreen/commit/fb0792ce8a27c179b616fe65bbf80beafe9c628b))

## [5.1.0](https://github.com/brunob/leaflet.fullscreen/compare/v5.0.0...v5.1.0) (2025-12-02)


### Features

* switch to inline SVGs for improved theming and bundling ([8c69c07](https://github.com/brunob/leaflet.fullscreen/commit/8c69c07a82c38fe6fdde525a098637efabddebe6))


### Bug Fixes

* handle fullscreenElement in ESC/browser exit ([0e118f0](https://github.com/brunob/leaflet.fullscreen/commit/0e118f0f1a4ed21b459ac58afc2f7d09e00492eb)), closes [#165](https://github.com/brunob/leaflet.fullscreen/issues/165)

## [5.0.0](https://github.com/brunob/leaflet.fullscreen/compare/v4.0.0...v5.0.0) (2025-12-01)


### ⚠ BREAKING CHANGES

* Source files moved to src/ directory, built files in dist/

- Restructure project: source in src/, distribution files in dist/
- Add Rollup build system to generate ES module and IIFE distributions
- Use named imports from Leaflet (Control, DomUtil, DomEvent, Map)
- Configure dual package exports in package.json (ESM + IIFE)
- Add Leaflet as peerDependency (^1.7.0 || >=2.0.0-alpha.1)
- Add demo pages for both ESM and IIFE usage patterns with Import Maps
- Create landing page with feature overview and demo links
- Update README with build command documentation

### Features

* **ci:** update release script to include build step ([2cadd79](https://github.com/brunob/leaflet.fullscreen/commit/2cadd79548a8cfd7188c69f76875966ba4fd465a))
* restructure project with ES module build system ([c13d336](https://github.com/brunob/leaflet.fullscreen/commit/c13d33610734d8ec8b00de11c8a114c1d906ed04))


### Bug Fixes

* add aria-label to fullscreen toggle state ([e77db6e](https://github.com/brunob/leaflet.fullscreen/commit/e77db6ee1e99e798c18dc8c47ea431abfdf9e78e))
* add missing charset meta tag in demo HTML files ([3cc995b](https://github.com/brunob/leaflet.fullscreen/commit/3cc995bfe39a1062bf2cb977f4c459c7becbc23d))
* remove CommonJS require export from package.json ([86153b2](https://github.com/brunob/leaflet.fullscreen/commit/86153b22830b5714535d35d3af31d478b87daadd))

## [4.0.0](https://github.com/brunob/leaflet.fullscreen/compare/v3.0.2...v4.0.1) (2025-03-07)


### ⚠ BREAKING CHANGES

* use leaflet specific classname for fullscreen icon to not affect other places that use the classname 'fullscreen-icon' ([10bb51d](https://github.com/brunob/leaflet.fullscreen/commit/10bb51d087e2901c07748d96922bfbf9a7e6bd72))

## [3.0.2](https://github.com/brunob/leaflet.fullscreen/compare/v3.0.1...v3.0.2) (2024-04-24)

## [3.0.1](https://github.com/brunob/leaflet.fullscreen/compare/v3.0.0...v3.0.1) (2024-01-22)


### Bug Fixes

* prevent firing `exitFullscreen` event on all maps of the page in `_handleFullscreenChange()` ([4c08f8e](https://github.com/brunob/leaflet.fullscreen/commit/4c08f8e9de8accddd739f2b0fd8e9218876aa787)), closes [#117](https://github.com/brunob/leaflet.fullscreen/issues/117)

## [3.0.0](https://github.com/brunob/leaflet.fullscreen/compare/dca62c57014d92a367750d13154e763e7f835071...v3.0.0) (2023-10-04)


### ⚠ BREAKING CHANGES

* screenfull is no longer exported by leaflet.fullscreen.

### Features

* add demo for toggleFullscreen method to demo web page ([4375e8a](https://github.com/brunob/leaflet.fullscreen/commit/4375e8a1884c2547375125ebfe6948c75298b492))
* integrate screenfull methods into leaflet.fullscreen ([768329b](https://github.com/brunob/leaflet.fullscreen/commit/768329bc287dd3a976e56d48e816176de5ffb749))


### Bug Fixes

* prevent error on ios ([dca62c5](https://github.com/brunob/leaflet.fullscreen/commit/dca62c57014d92a367750d13154e763e7f835071)), closes [#99](https://github.com/brunob/leaflet.fullscreen/issues/99)
