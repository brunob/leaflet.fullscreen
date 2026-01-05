/*!
 * leaflet.fullscreen
 * (c) Bruno B.; MIT License
 * https://github.com/brunob/leaflet.fullscreen
 */
/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.L = global.L || {}, global.L.Control = global.L.Control || {}, global.L.Control.FullScreen = factory(global.L)));
})(this, (function (leaflet) { 'use strict';

	if (typeof document === 'undefined') {
		console.warn('"window.document" is undefined; leaflet.fullscreen requires this object to access the DOM');
	}

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

	const FullScreen = leaflet.Control.extend({
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
			leaflet.DomEvent
				.off(this.link, 'click', leaflet.DomEvent.stop)
				.off(this.link, 'click', this.toggleFullScreen, this);

			if (this._screenfull.isEnabled) {
				leaflet.DomEvent
					.off(document, this._screenfull.nativeAPI.fullscreenchange, leaflet.DomEvent.stop)
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

			leaflet.DomEvent.disableClickPropagation(container);

			leaflet.DomEvent
				.on(this.link, 'click', leaflet.DomEvent.stop)
				.on(this.link, 'click', fn, context);

			if (this._screenfull.isEnabled) {
				leaflet.DomEvent
					.on(document, this._screenfull.nativeAPI.fullscreenchange, leaflet.DomEvent.stop)
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

	leaflet.Map.include({
		toggleFullscreen() {
			this.fullscreenControl.toggleFullScreen();
		}
	});

	return FullScreen;

}));
