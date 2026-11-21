import { Map } from 'leaflet';
// Namespace import, because a named import of `FullscreenControl` would fail to load on Leaflet 1.
import * as Leaflet from 'leaflet';
import { createLeaflet1Control } from './leaflet1.js';
import { createLeaflet2Control } from './leaflet2.js';

if (typeof document === 'undefined') {
	console.warn('"window.document" is undefined; leaflet.fullscreen requires this object to access the DOM');
}

const FullScreen = Leaflet.FullscreenControl
	? createLeaflet2Control(Leaflet.FullscreenControl)
	: createLeaflet1Control();

Map.include({
	toggleFullscreen() {
		return this.fullscreenControl.toggleFullScreen();
	}
});

Map.mergeOptions({
	fullscreenControl: false
});

Map.addInitHook(function() {
	if (this.options.fullscreenControl) {
		this.addControl(new FullScreen(this.options.fullscreenControlOptions));
	}
});

export { FullScreen };
export default FullScreen;
