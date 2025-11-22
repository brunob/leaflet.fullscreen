# Leaflet.Control.FullScreen

## What ?

**Leaflet.Control.FullScreen** is a simple plugin for [Leaflet](https://leafletjs.com/) that adds a fullscreen button to your maps using the Fullscreen API.

All major browsers support the Fullscreen API. For details about which browsers support this API, see the [CanIuse](https://caniuse.com/fullscreen) website.

## How ?

Include `Control.FullScreen.js` and `Control.FullScreen.css` in your page:

```html
<link rel="stylesheet" href="Control.FullScreen.css" />
<script src="Control.FullScreen.js"></script>
```

Add the fullscreen control to the map:

```js
let map = new L.Map('map', {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft'
	}
});
```

If your map has a zoomControl the fullscreen button will be added at the bottom of this one.

If your map doesn't have a zoomControl the fullscreen button will be added to topleft corner of the map (same as the zoomControl).

If you want to use the plugin on a map embedded in an iframe, don't forget to set `allowfullscreen` attribute on your iframe.

**Option, events and methods**:

```js
// create a fullscreen button and add it to the map
L.control
	.fullscreen({
		position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
		title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
		titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
		content: null, // change the content of the button, can be HTML, default null
		forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
		forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
		fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
	})
	.addTo(map);

// events are fired when entering or exiting fullscreen.
map.on('enterFullscreen', function () {
	console.log('entered fullscreen');
});

map.on('exitFullscreen', function () {
	console.log('exited fullscreen');
});

// you can also toggle fullscreen from map object
map.toggleFullscreen();
```

## Where ?

- Source code: <https://github.com/brunob/leaflet.fullscreen>
- Downloads: <https://github.com/brunob/leaflet.fullscreen/releases>
- Demo: <https://brunob.github.io/leaflet.fullscreen/>

## Use as ES module

To use this plugin with a bundler (Webpack, Vite, etc.):

1. Install leaflet.fullscreen with your package manager:

   ```bash
   npm install leaflet.fullscreen
   ```

2. Import the module in your code:

   ```js
   import { FullScreen } from 'leaflet.fullscreen';

   // Add control to your map
   map.addControl(
   	new FullScreen({
   		position: 'topleft'
   	})
   );
   ```

3. Import the CSS (if your bundler supports it):

   ```js
   import 'leaflet.fullscreen/dist/Control.FullScreen.css';
   ```

   Or add it manually to your HTML:

   ```html
   <link rel="stylesheet" href="node_modules/leaflet.fullscreen/dist/Control.FullScreen.css" />
   ```

Alternatively, you can use the classic approach with side effects:

```js
import L from 'leaflet';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/dist/Control.FullScreen.css';

const map = new L.Map('map', {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft'
	}
});
```

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/brunob/leaflet.fullscreen/issues) in this repository.

Pull requests are of course also very welcome 🙂

The [CHANGELOG.md](CHANGELOG.md) is generated with `standard-changelog` (using the command `npm run release`).

To make this possible the commit messages / pull request titles must follow the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>: <subject>

[optional body]

[optional footer(s)]
```

The following is the list of supported types:

- build: changes that affect build components like build tool, ci pipeline, dependencies, project version, etc...
- chore: changes that aren't user-facing (e.g. merging branches).
- ci: changes to the CI configuration files and scripts (basically directory .github/workflows).
- docs: changes that affect the documentation only.
- feat: changes that introduce a new feature.
- fix: changes that patch a bug.
- perf: changes which improve performance.
- refactor: changes which neither fix a bug nor add a feature.
- revert: changes that revert a previous commit.
- style: changes that don't affect code logic, such as white-spaces, formatting, missing semi-colons.
- test: changes that add missing tests or correct existing tests.

For breaking changes a footer with the following content must be used.
BREAKING CHANGE: <description of what is broken by this commit>

### Developer commands

- `npm run build` - Build the distribution files from source.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

## Credits

- This plugin is inspired by [leaflet.zoomfs](https://github.com/elidupuis/leaflet.zoomfs) from elidupuis.
- Icons from [Font Awesome v5.15.4](https://github.com/FortAwesome/Font-Awesome/releases/tag/5.15.4): [Creative Commons Attribution 4.0](https://fontawesome.com/license/free).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
