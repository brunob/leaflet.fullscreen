// Type definitions for Leaflet.fullscreen 2.0
// for project: https://github.com/brunob/leaflet.fullscreen
// based on: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/leaflet.fullscreen
// Definitions by: William Comartin <https://github.com/wcomartin>
//                 Dan Manastireanu <https://github.com/danmana>
// TypeScript Version: 3.4

import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class Fullscreen extends Control {
      constructor(options?: FullscreenOptions);
      options: FullscreenOptions;
    }

    interface FullscreenOptions {
      content?: string;
      position?: ControlPosition;
      title?: string;
      titleCancel?: string;
      forceSeparateButton?: boolean;
      forcePseudoFullscreen?: boolean;
      pseudoFullscreen?: boolean;
      fullscreenElement?: false | HTMLElement;
    }
  }

  namespace control {
    function fullscreen(options?: Control.FullscreenOptions): Control.Fullscreen;
  }

  interface MapOptions {
    fullscreenControl?: boolean;
    fullscreenControlOptions?: Control.FullscreenOptions;
  }

  interface Map {
    toggleFullScreen(): void;
  }
}
