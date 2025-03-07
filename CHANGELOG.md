# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
