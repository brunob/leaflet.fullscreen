/*!
 * leaflet.fullscreen
 * (c) Bruno B.; MIT License
 * https://github.com/brunob/leaflet.fullscreen
 */
/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */
import * as Leaflet from 'leaflet';
import { Control, DomEvent, Map } from 'leaflet';

// Leaflet 1 implementation. Built lazily because Leaflet 2 has no `Control.extend`.
function createLeaflet1Control() {
	const nativeAPI = (() => {
		const methodMap = [
			// Standard
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// New WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'
			]
		];

		const baseList = methodMap[0];
		const ret = {};

		for (const methodList of methodMap) {
			if (methodList[1] in document) {
				for (let i = 0; i < methodList.length; i++) {
					ret[baseList[i]] = methodList[i];
				}
				return ret;
			}
		}

		return false;
	})();

	const eventNameMap = {
		change: nativeAPI.fullscreenchange,
		error: nativeAPI.fullscreenerror,
	};

	const fullscreenAPI = {
		// Request fullscreen for a specific element
		async request(element, options) {
			element = element || document.documentElement;
			const requestMethod = nativeAPI.requestFullscreen;

			await this._callNative(() => {
				return element[requestMethod](options);
			});
		},
		// Exit fullscreen mode
		async exit() {
			if (!this.isFullscreen) {
				return;
			}
			const exitMethod = nativeAPI.exitFullscreen;

			await this._callNative(() => {
				return document[exitMethod]();
			});
		},
		// Helper to handle browser differences (Promise vs Event)
		async _callNative(action) {
			const result = action();

			// Modern browsers return a Promise from requestFullscreen/exitFullscreen
			if (result instanceof Promise) {
				await result;
				return;
			}

			// Fallback for Safari < 16.4 (March 2023) which doesn't return a Promise
			await new Promise((resolve) => {
				const listener = () => {
					this.off('change', listener);
					resolve();
				};
				this.on('change', listener);
			});
		},
		// Add event listener for fullscreen changes
		on(event, callback) {
			const eventName = eventNameMap[event];
			if (eventName) {
				document.addEventListener(eventName, callback);
			}
		},
		// Remove event listener
		off(event, callback) {
			const eventName = eventNameMap[event];
			if (eventName) {
				document.removeEventListener(eventName, callback);
			}
		},
		nativeAPI: nativeAPI
	};

	Object.defineProperties(fullscreenAPI, {
		isFullscreen: {
			get() {
				return Boolean(document[nativeAPI.fullscreenElement]);
			}
		},
		isEnabled: {
			enumerable: true,
			get() {
				// Coerce to boolean in case of old WebKit
				return Boolean(document[nativeAPI.fullscreenEnabled]);
			}
		}
	});

	return Control.extend({
		options: {
			position: 'topleft',
			title: 'Full Screen',
			titleCancel: 'Exit Full Screen',
			forceSeparateButton: false,
			forcePseudoFullscreen: false,
			fullscreenElement: false
		},

		_screenfull: fullscreenAPI,

		onAdd(map) {
			let className = 'leaflet-control-zoom-fullscreen';
			let container;
			let content = '';

			if (map.zoomControl && !this.options.forceSeparateButton) {
				container = map.zoomControl._container;
			} else {
				container = document.createElement('div');
				container.className = 'leaflet-bar';
			}

			if (this.options.content) {
				content = this.options.content;
			} else {
				className += ' leaflet-fullscreen-icon';
			}

			this._createButton(this.options.title, className, content, container, this.toggleFullScreen, this);
			this._map.fullscreenControl = this;

			this._map.on('enterFullscreen exitFullscreen', this._toggleState, this);

			return container;
		},

		onRemove() {
			DomEvent
				.off(this.link, 'click', DomEvent.stop)
				.off(this.link, 'click', this.toggleFullScreen, this);

			if (this._screenfull.isEnabled) {
				DomEvent
					.off(document, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
					.off(document, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, this);
			}
		},

		_createButton(title, className, content, container, fn, context) {
			this.link = document.createElement('a');
			this.link.className = className;
			container.appendChild(this.link);
			this.link.href = '#';
			this.link.title = title;
			this.link.innerHTML = content;

			this.link.setAttribute('role', 'button');
			this.link.setAttribute('aria-label', title);

			DomEvent.disableClickPropagation(container);

			DomEvent
				.on(this.link, 'click', DomEvent.stop)
				.on(this.link, 'click', fn, context);

			if (this._screenfull.isEnabled) {
				DomEvent
					.on(document, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
					.on(document, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, context);
			}

			return this.link;
		},

		async toggleFullScreen() {
			const map = this._map;
			const { fullscreenElement, forcePseudoFullscreen } = this.options;

			// Target element: use custom element if provided, otherwise the map container
			const container = fullscreenElement || map.getContainer();

			// Check if we should use the native Fullscreen API
			const useNative = this._screenfull.isEnabled && !forcePseudoFullscreen;

			if (map._isFullscreen) {
				// --- EXIT FULLSCREEN ---

				// Set flag to prevent the 'fullscreenchange' listener from firing a duplicate exit event
				map._exitFired = true;

				if (useNative) {
					await this._screenfull.exit();
				} else {
					container.classList.remove('leaflet-pseudo-fullscreen');
				}

				map.invalidateSize();
				map._isFullscreen = false;
				map.fire('exitFullscreen');
			} else {
				// --- ENTER FULLSCREEN ---

				map._exitFired = false;

				if (useNative) {
					await this._screenfull.request(container);
				} else {
					container.classList.add('leaflet-pseudo-fullscreen');
				}

				map.invalidateSize();
				map._isFullscreen = true;
				map.fire('enterFullscreen');
			}
		},

		_toggleState() {
			const { title, titleCancel } = this.options;
			const isFullscreen = this._map._isFullscreen;

			// Update Title & Aria Label
			this.link.title = isFullscreen ? titleCancel : title;
			this.link.setAttribute('aria-label', this.link.title);
			this.link.setAttribute('aria-pressed', isFullscreen.toString());

			// Update Icon Class
			this.link.classList.toggle('leaflet-fullscreen-on', isFullscreen);
		},

		_handleFullscreenChange() {
			const map = this._map;

			// Check if fullscreen was exited via browser (ESC key or browser UI)
			// and we didn't trigger the exit ourselves
			const wasExitedExternally = !this._screenfull.isFullscreen && map._isFullscreen && !map._exitFired;

			if (wasExitedExternally) {
				// Sync internal state with browser state
				map._exitFired = true;
				map._isFullscreen = false;

				// Notify listeners and adjust map size
				map.fire('exitFullscreen');
				map.invalidateSize();
			}
		}
	});
}

// Leaflet 2 implementation: maps the plugin API onto Leaflet's built-in FullscreenControl.
function createLeaflet2Control(FullscreenControl) {
	return class FullScreen extends FullscreenControl {
		static defaultOptions = {
			title: 'Full Screen',
			titleCancel: 'Exit Full Screen',
			content: null,
			forceSeparateButton: false,
			forcePseudoFullscreen: false,
			fullscreenElement: false
		};

		constructor(options) {
			super(options);

			const o = this.options;
			Object.assign(o, {
				enterTitle: o.title,
				exitTitle: o.titleCancel,
				enterText: o.content ?? '',
				exitText: o.content ?? '',
				container: o.fullscreenElement || undefined,
				pseudo: o.forcePseudoFullscreen
			});
		}

		onAdd(map) {
			const container = super.onAdd(map);

			this.link = this._link;
			this.link.classList.add('leaflet-control-zoom-fullscreen');
			this.link.classList.toggle('leaflet-fullscreen-icon', !this.options.content);
			this.link.setAttribute('aria-pressed', 'false');

			map.fullscreenControl = this;
			map.on('enterfullscreen exitfullscreen', this._syncPluginState, this);

			return container;
		}

		onRemove(map) {
			// The core exits fullscreen here, so keep listening until it has done so.
			super.onRemove(map);
			map.off('enterfullscreen exitfullscreen', this._syncPluginState, this);
		}

		// Leaflet puts every control into its own corner element, so move the button into the zoom bar afterwards.
		addTo(map) {
			super.addTo(map);

			const zoomBar = !this.options.forceSeparateButton && map.zoomControl?.getContainer();
			if (zoomBar) {
				this._container.remove();
				zoomBar.append(this.link);
				this._container = this.link;
			}

			return this;
		}

		// Resolves once the state has changed, like the Leaflet 1 implementation.
		toggleFullScreen() {
			const type = this.isFullscreen() ? 'exitfullscreen' : 'enterfullscreen';
			const changed = new Promise((resolve) => {
				this._map.once(type, () => resolve());
			});

			this.toggle();
			return changed;
		}

		_syncPluginState({ type }) {
			const isFullscreen = type === 'enterfullscreen';

			this._map._isFullscreen = isFullscreen;
			this.link.setAttribute('aria-pressed', String(isFullscreen));
			this.link.classList.toggle('leaflet-fullscreen-on', isFullscreen);
			this._map.fire(isFullscreen ? 'enterFullscreen' : 'exitFullscreen');
		}
	};
}

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

export { FullScreen, FullScreen as default };
