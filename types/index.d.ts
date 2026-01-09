declare module 'leaflet' {
	interface FullScreenOptions extends ControlOptions {
		/**
		 * Position of the control.
		 * @default 'topleft'
		 */
		position?: ControlPosition;

		/**
		 * Title of the button when not in fullscreen mode.
		 * @default 'Full Screen'
		 */
		title?: string;

		/**
		 * Title of the button when in fullscreen mode.
		 * @default 'Exit Full Screen'
		 */
		titleCancel?: string;

		/**
		 * Custom HTML content for the button.
		 * If not provided, a default icon is used.
		 */
		content?: string;

		/**
		 * Force the control to be separate from the zoom control.
		 * @default false
		 */
		forceSeparateButton?: boolean;

		/**
		 * Force pseudo-fullscreen mode (CSS-based) instead of native fullscreen API.
		 * @default false
		 */
		forcePseudoFullscreen?: boolean;

		/**
		 * DOM element to make fullscreen instead of the map container.
		 * Can be a CSS selector string or an HTMLElement.
		 * @default false
		 */
		fullscreenElement?: HTMLElement | false;
	}

	interface MapOptions {
		/**
		 * Whether to add a fullscreen control to the map.
		 * Can be `true` for default options or an options object.
		 */
		fullscreenControl?: boolean | FullScreenOptions;

		/**
		 * Options for the fullscreen control (if fullscreenControl is true).
		 */
		fullscreenControlOptions?: FullScreenOptions;
	}

	interface Map {
		/**
		 * Reference to the fullscreen control instance.
		 */
		fullscreenControl?: Control.FullScreen;

		/**
		 * Whether the map is currently in fullscreen mode.
		 */
		_isFullscreen?: boolean;

		/**
		 * Toggle fullscreen mode on the map.
		 */
		toggleFullscreen(): Promise<void>;
	}

	/**
	 * Events fired by the fullscreen control.
	 */
	interface LeafletEventHandlerFnMap {
		/**
		 * Fired when the map enters fullscreen mode.
		 */
		enterFullscreen?: LeafletEventHandlerFn;

		/**
		 * Fired when the map exits fullscreen mode.
		 */
		exitFullscreen?: LeafletEventHandlerFn;
	}

	namespace Control {
		/**
		 * A control that adds fullscreen functionality to the map.
		 */
		class FullScreen extends Control {
			options: FullScreenOptions;

			constructor(options?: FullScreenOptions);

			/**
			 * Toggle fullscreen mode.
			 */
			toggleFullScreen(): Promise<void>;
		}

		/**
		 * Creates a new fullscreen control.
		 */
		function fullscreen(options?: FullScreenOptions): FullScreen;
	}

	namespace control {
		/**
		 * Creates a new fullscreen control.
		 */
		function fullscreen(options?: FullScreenOptions): Control.FullScreen;
	}
}

// ES module exports
import { Control } from 'leaflet';

/**
 * ES module named export (recommended).
 * @example
 * import { FullScreen } from 'leaflet.fullscreen';
 * map.addControl(new FullScreen({ position: 'topleft' }));
 */
export class FullScreen extends Control.FullScreen {
	constructor(options?: Control.FullScreenOptions);
}

/**
 * ES module default export (also available).
 * @example
 * import FullScreen from 'leaflet.fullscreen';
 * map.addControl(new FullScreen({ position: 'topleft' }));
 */
export default FullScreen;
