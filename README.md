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

## News

**Version 4**

This version introduce a small breaking change for case where people use a customized icon for the fullscreen button. The class of the icon have been switched from `.fullscreen-icon` to `.leaflet-fullscreen-icon` which is more specific in order to avoid side effects with other CSS libs.

## Use as ESM module

To use this plugin in the code of a project (based on e.g. React or Angular) follow these steps:

1. install leaflet.fullscreen with your package manager (e.g. `npm install leaflet.fullscreen`).

2. Update your code

```js
import L from 'leaflet';
import 'leaflet.fullscreen';

const let map = new L.Map('map', {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft'
	}
});
```

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/brunob/leaflet.fullscreen/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Developer commands

- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

## Credits

- This plugin is inspired by [leaflet.zoomfs](https://github.com/elidupuis/leaflet.zoomfs) from elidupuis.
- Icons from [Font Awesome v5.15.4](https://github.com/FortAwesome/Font-Awesome/releases/tag/5.15.4): [Creative Commons Attribution 4.0](https://fontawesome.com/license/free).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
