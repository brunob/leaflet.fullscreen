// Leaflet 2 implementation: maps the plugin API onto Leaflet's built-in FullscreenControl.
export function createLeaflet2Control(FullscreenControl) {
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
