import { Control, DomUtil, DomEvent, Map } from 'leaflet';

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

const FullScreen = Control.extend({
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
			container = DomUtil.create('div', 'leaflet-bar');
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
				.off(this._container, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
				.off(this._container, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, this);

			DomEvent
				.off(document, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
				.off(document, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, this);
		}
	},

	_createButton(title, className, content, container, fn, context) {
		this.link = DomUtil.create('a', className, container);
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
				.on(container, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
				.on(container, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, context);

			DomEvent
				.on(document, this._screenfull.nativeAPI.fullscreenchange, DomEvent.stop)
				.on(document, this._screenfull.nativeAPI.fullscreenchange, this._handleFullscreenChange, context);
		}

		return this.link;
	},

	toggleFullScreen() {
		const map = this._map;
		map._exitFired = false;
		if (map._isFullscreen) {
			if (this._screenfull.isEnabled && !this.options.forcePseudoFullscreen) {
				this._screenfull.exit().then(() => map.invalidateSize());
			} else {
				const _targetExit = this.options.fullscreenElement
					? this.options.fullscreenElement
					: map._container;
				if (_targetExit && _targetExit.classList) {
					_targetExit.classList.remove('leaflet-pseudo-fullscreen');
				}
				map.invalidateSize();
			}
			map.fire('exitFullscreen');
			map._exitFired = true;
			map._isFullscreen = false;
		} else {
			if (this._screenfull.isEnabled && !this.options.forcePseudoFullscreen) {
				this._screenfull.request(this.options.fullscreenElement
					? this.options.fullscreenElement
					: map._container).then(() => map.invalidateSize());
			} else {
				const _targetEnter = this.options.fullscreenElement
					? this.options.fullscreenElement
					: map._container;
				if (_targetEnter && _targetEnter.classList) {
					_targetEnter.classList.add('leaflet-pseudo-fullscreen');
				}
				map.invalidateSize();
			}
			map.fire('enterFullscreen');
			map._isFullscreen = true;
		}
	},

	_toggleState() {
		const { title, titleCancel } = this.options;
		const isFullscreen = this._map._isFullscreen;

		// Update Title & Aria Label
		this.link.title = isFullscreen ? title : titleCancel;
		this.link.setAttribute('aria-label', this.link.title);

		// Update Icon Class
		this.link.classList.toggle('leaflet-fullscreen-on', !isFullscreen);
	},

	_handleFullscreenChange(ev) {
		const map = this._map;
		const targetElement = this.options.fullscreenElement || map.getContainer();

		// Check if the event is for our element and fullscreen was exited via browser (ESC or UI)
		const isOurElement = ev.target === targetElement;
		const wasExitedExternally = !this._screenfull.isFullscreen && !map._exitFired;

		if (isOurElement && wasExitedExternally) {
			// Sync internal state with browser state
			map._exitFired = true;

			// Notify listeners and adjust map size
			map.fire('exitFullscreen');
			map._isFullscreen = false;
			this._screenfull.exit().then(() => map.invalidateSize());
		}
	}
});

Map.include({
	toggleFullscreen() {
		this.fullscreenControl.toggleFullScreen();
	}
});

export { FullScreen };
export default FullScreen;
