/*!
 * leaflet.fullscreen
 * external dependency: 'screenfull'
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // define an AMD module that requires 'leaflet' and 'screenfull'
    define(['leaflet', 'screenfull'], factory);
  } else if (typeof modules === 'object' && module.exports) {
    // define a CommonJS module that requires 'leaflet' and 'screenfull'
    module.exports = factory(require('leaflet'), require('screenfull'));
  } else {
    // Assume 'leaflet' and 'screenfull' are loaded into global variable already
    factory(root.L, root.screenfull);
  }
})(this, function (leaflet, screenfull) {
  'use strict';

  leaflet.Control.FullScreen = leaflet.Control.extend({
    options: {
      position: 'topleft',
      title: 'Full Screen',
      titleCancel: 'Exit Full Screen',
      forceSeparateButton: false,
      forcePseudoFullscreen: false,
      fullscreenElement: false
    },

    _screenfull: screenfull,

    onAdd: function (map) {
      var className = 'leaflet-control-zoom-fullscreen',
        container,
        content = '';

      if (map.zoomControl && !this.options.forceSeparateButton) {
        container = map.zoomControl._container;
      } else {
        container = leaflet.DomUtil.create('div', 'leaflet-bar');
      }

      if (this.options.content) {
        content = this.options.content;
      } else {
        className += ' fullscreen-icon';
      }

      this._createButton(
        this.options.title,
        className,
        content,
        container,
        this.toggleFullScreen,
        this
      );
      this._map.fullscreenControl = this;

      this._map.on('enterFullscreen exitFullscreen', this._toggleTitle, this);

      return container;
    },

    onRemove: function () {
      leaflet.DomEvent.off(this.link, 'click', leaflet.DomEvent.stopPropagation)
        .off(this.link, 'click', leaflet.DomEvent.preventDefault)
        .off(this.link, 'click', this.toggleFullScreen, this);

      leaflet.DomEvent.off(
        this._container,
        this._screenfull.raw.fullscreenchange,
        leaflet.DomEvent.stopPropagation
      )
        .off(
          this._container,
          this._screenfull.raw.fullscreenchange,
          leaflet.DomEvent.preventDefault
        )
        .off(
          this._container,
          this._screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          this
        );

      leaflet.DomEvent.off(
        document,
        this._screenfull.raw.fullscreenchange,
        leaflet.DomEvent.stopPropagation
      )
        .off(
          document,
          this._screenfull.raw.fullscreenchange,
          leaflet.DomEvent.preventDefault
        )
        .off(
          document,
          this._screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          this
        );
    },

    _createButton: function (title, className, content, container, fn, context) {
      this.link = leaflet.DomUtil.create('a', className, container);
      this.link.href = '#';
      this.link.title = title;
      this.link.innerHTML = content;

      this.link.setAttribute('role', 'button');
      this.link.setAttribute('aria-label', title);

      leaflet.DomEvent.on(this.link, 'click', leaflet.DomEvent.stopPropagation)
        .on(this.link, 'click', leaflet.DomEvent.preventDefault)
        .on(this.link, 'click', fn, context);

      leaflet.DomEvent.on(
        container,
        this._screenfull.raw.fullscreenchange,
        leaflet.DomEvent.stopPropagation
      )
        .on(
          container,
          this._screenfull.raw.fullscreenchange,
          leaflet.DomEvent.preventDefault
        )
        .on(
          container,
          this._screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          context
        );

      leaflet.DomEvent.on(
        document,
        this._screenfull.raw.fullscreenchange,
        leaflet.DomEvent.stopPropagation
      )
        .on(
          document,
          this._screenfull.raw.fullscreenchange,
          leaflet.DomEvent.preventDefault
        )
        .on(
          document,
          this._screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          context
        );

      return this.link;
    },

    toggleFullScreen: function () {
      var map = this._map;
      map._exitFired = false;
      if (map._isFullscreen) {
        if (this._screenfull.isEnabled && !this.options.forcePseudoFullscreen) {
          this._screenfull.exit();
        } else {
          leaflet.DomUtil.removeClass(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map._container,
            'leaflet-pseudo-fullscreen'
          );
          map.invalidateSize();
        }
        map.fire('exitFullscreen');
        map._exitFired = true;
        map._isFullscreen = false;
      } else {
        if (this._screenfull.isEnabled && !this.options.forcePseudoFullscreen) {
          this._screenfull.request(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map._container
          );
        } else {
          leaflet.DomUtil.addClass(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map._container,
            'leaflet-pseudo-fullscreen'
          );
          map.invalidateSize();
        }
        map.fire('enterFullscreen');
        map._isFullscreen = true;
      }
    },

    _toggleTitle: function () {
      this.link.title = this._map._isFullscreen
        ? this.options.title
        : this.options.titleCancel;
    },

    _handleFullscreenChange: function () {
      var map = this._map;
      map.invalidateSize();
      if (!this._screenfull.isFullscreen && !map._exitFired) {
        map.fire('exitFullscreen');
        map._exitFired = true;
        map._isFullscreen = false;
      }
    }
  });

  leaflet.Map.include({
    toggleFullscreen: function () {
      this.fullscreenControl.toggleFullScreen();
    }
  });

  leaflet.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
      this.addControl(
        leaflet.control.fullscreen(this.options.fullscreenControlOptions)
      );
    }
  });

  leaflet.control.fullscreen = function (options) {
    return new leaflet.Control.FullScreen(options);
  };

  return leaflet;
});
