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
	request(element, options) {
		return new Promise((resolve, reject) => {
			const onFullScreenEntered = function() {
				this.off('change', onFullScreenEntered);
				resolve();
			}.bind(this);

			this.on('change', onFullScreenEntered);
			element = element || document.documentElement;
			const returnPromise = element[nativeAPI.requestFullscreen](options);
			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenEntered).catch(reject);
			}
		});
	},
	exit() {
		return new Promise((resolve, reject) => {
			if (!this.isFullscreen) {
				resolve();
				return;
			}

			const onFullScreenExit = function() {
				this.off('change', onFullScreenExit);
				resolve();
			}.bind(this);

			this.on('change', onFullScreenExit);
			const returnPromise = document[nativeAPI.exitFullscreen]();
			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenExit).catch(reject);
			}
		});
	},
	on(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			document.addEventListener(eventName, callback, false);
		}
	},
	off(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			document.removeEventListener(eventName, callback, false);
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
		this.link.title = this._map._isFullscreen
			? this.options.title
			: this.options.titleCancel;
		if (this.link && this.link.classList) {
			if (this._map._isFullscreen) {
				this.link.classList.remove('leaflet-fullscreen-on');
			} else {
				this.link.classList.add('leaflet-fullscreen-on');
			}
		}
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
