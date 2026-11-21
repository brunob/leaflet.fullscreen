import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { exitFullscreenExternally } from './setup.js';
import * as Leaflet from 'leaflet';

const { Map } = Leaflet;
const isLeaflet2 = Boolean(Leaflet.FullscreenControl);

// Import after setup (Fullscreen API is mocked)
const { FullScreen } = await import('../src/Control.FullScreen.js');

describe('FullScreen Control', () => {
	let map;
	const mountControl = (options) => {
		const control = new FullScreen(options);
		map.addControl(control);
		return control;
	};

	beforeEach(() => {
		map = new Map(document.createElement('div'));
		document.body.innerHTML = '';
		document.fullscreenElement = null;
	});

	describe('Initialization & Options', () => {
		it('should create a FullScreen control instance', () => {
			const control = new FullScreen();
			assert.ok(control, 'Control should be created');
			assert.strictEqual(typeof control.toggleFullScreen, 'function', 'Should have toggleFullScreen method');
		});

		it('should accept custom options', () => {
			const control = new FullScreen({
				position: 'topright',
				title: 'Custom Title'
			});
			assert.strictEqual(control.options.title, 'Custom Title');
		});

		it('should have default options', () => {
			const control = new FullScreen();
			assert.strictEqual(control.options.position, 'topleft');
			assert.strictEqual(control.options.title, 'Full Screen');
			assert.strictEqual(control.options.titleCancel, 'Exit Full Screen');
			assert.strictEqual(control.options.forceSeparateButton, false);
			assert.strictEqual(control.options.forcePseudoFullscreen, false);
		});

		it('should auto-create fullscreen control via map options init hook', () => {
			const mapContainer = document.createElement('div');
			document.body.appendChild(mapContainer);

			const mapWithControlOption = new Map(mapContainer, {
				fullscreenControl: true,
				fullscreenControlOptions: {
					position: 'topright',
					title: 'Go Fullscreen'
				}
			});

			assert.ok(mapWithControlOption.fullscreenControl, 'Control should be auto-added from map options');
			assert.ok(mapWithControlOption.fullscreenControl instanceof FullScreen, 'Control should be a FullScreen instance');
			assert.strictEqual(mapWithControlOption.fullscreenControl.options.position, 'topright');
			assert.strictEqual(mapWithControlOption.fullscreenControl.options.title, 'Go Fullscreen');

			mapWithControlOption.remove();
		});
	});

	describe('DOM Creation', () => {
		it('should create DOM elements when added to map', () => {
			const control = mountControl();
			const container = control.getContainer();

			assert.ok(container instanceof HTMLElement, 'Should return an HTML element');
			assert.strictEqual(control.link.tagName, 'A', 'Should create a link element');
			assert.ok(container.contains(control.link), 'Container should contain the link');
		});

		it('should support custom content in button', () => {
			const control = mountControl({
				content: '<span>FS</span>'
			});
			const link = control.link;

			assert.ok(link, 'Link should exist');
			assert.strictEqual(control.options.content, '<span>FS</span>');
		});

		it('should create separate button when forceSeparateButton is true', () => {
			const control = mountControl({
				forceSeparateButton: true
			});
			const container = control._container;

			assert.ok(container.classList.contains('leaflet-bar'));
		});
	});

	describe('Accessibility (ARIA)', () => {
		it('should set aria attributes on button', () => {
			const control = mountControl();
			const link = control.link;

			assert.strictEqual(link.getAttribute('role'), 'button');
			assert.ok(link.hasAttribute('aria-label'));
		});

		it('should set aria-pressed when entering fullscreen', async() => {
			const control = mountControl();
			const link = control.link;

			await control.toggleFullScreen();
			assert.strictEqual(link.getAttribute('aria-pressed'), 'true');
		});

		it('should update aria-pressed when exiting fullscreen', async() => {
			const control = mountControl();
			const link = control.link;

			await control.toggleFullScreen();
			assert.strictEqual(link.getAttribute('aria-pressed'), 'true');

			await control.toggleFullScreen();
			assert.strictEqual(link.getAttribute('aria-pressed'), 'false');
		});
	});

	describe('Fullscreen Toggle & State', () => {
		it('should expose toggleFullScreen method', () => {
			const control = new FullScreen();
			assert.strictEqual(typeof control.toggleFullScreen, 'function');
		});

		it('should set _isFullscreen flag on map', async() => {
			const control = mountControl();

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);
		});

		it('should toggle fullscreen state', async() => {
			const control = mountControl();

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, false);
		});

		it('should toggle CSS class on state change', async() => {
			const control = mountControl();
			const link = control.link;

			assert.ok(!link.classList.contains('leaflet-fullscreen-on'));

			await control.toggleFullScreen();
			assert.ok(link.classList.contains('leaflet-fullscreen-on'));

			await control.toggleFullScreen();
			assert.ok(!link.classList.contains('leaflet-fullscreen-on'));
		});

		it('should update title when toggling', async() => {
			const control = mountControl();
			const link = control.link;

			assert.strictEqual(link.title, 'Full Screen');

			await control.toggleFullScreen();
			assert.strictEqual(link.title, 'Exit Full Screen');

			await control.toggleFullScreen();
			assert.strictEqual(link.title, 'Full Screen');
		});

		it('should toggle via map.toggleFullscreen()', async() => {
			mountControl();

			await map.toggleFullscreen();
			assert.strictEqual(map._isFullscreen, true);

			await map.toggleFullscreen();
			assert.strictEqual(map._isFullscreen, false);
		});
	});

	describe('Events', () => {
		it('should fire enterFullscreen event', async() => {
			const control = mountControl();

			let eventFired = false;
			map.on('enterFullscreen', () => {
				eventFired = true;
			});

			await control.toggleFullScreen();
			assert.ok(eventFired, 'enterFullscreen event should be fired');
		});

		it('should fire exitFullscreen event on toggle off', async() => {
			const control = mountControl();

			let exitEventFired = false;
			map.on('exitFullscreen', () => {
				exitEventFired = true;
			});

			await control.toggleFullScreen();
			await control.toggleFullScreen();

			assert.ok(exitEventFired);
		});

		it('should handle external fullscreen exit', async() => {
			const control = mountControl();

			let exitEventFired = false;
			map.on('exitFullscreen', () => {
				exitEventFired = true;
			});

			// Enter fullscreen
			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);

			exitFullscreenExternally();

			assert.strictEqual(map._isFullscreen, false);
			assert.strictEqual(control.link.getAttribute('aria-pressed'), 'false');
			assert.ok(exitEventFired);
		});
	});

	describe('Options & Features', () => {
		it('should use pseudo-fullscreen when forcePseudoFullscreen is true', async() => {
			const control = mountControl({
				forcePseudoFullscreen: true
			});

			const container = map.getContainer();

			await control.toggleFullScreen();
			assert.ok(container.classList.contains('leaflet-pseudo-fullscreen'));
			assert.strictEqual(map._isFullscreen, true);

			await control.toggleFullScreen();
			assert.ok(!container.classList.contains('leaflet-pseudo-fullscreen'));
			assert.strictEqual(map._isFullscreen, false);
		});

		it('should support custom fullscreenElement', async() => {
			const customElement = document.createElement('div');
			const control = mountControl({
				fullscreenElement: customElement,
				forcePseudoFullscreen: true
			});

			await control.toggleFullScreen();
			assert.ok(customElement.classList.contains('leaflet-pseudo-fullscreen'));

			await control.toggleFullScreen();
			assert.ok(!customElement.classList.contains('leaflet-pseudo-fullscreen'));
		});

		it('should provide map.fullscreenControl reference', async() => {
			const control = mountControl();

			assert.ok(control.toggleFullScreen);
			assert.ok(map.fullscreenControl);
			assert.strictEqual(map.fullscreenControl, control);
		});

		it('should add the button to the zoom bar unless forceSeparateButton is true', () => {
			const grouped = mountControl();
			assert.ok(map.zoomControl.getContainer().contains(grouped.link));

			const separate = mountControl({ forceSeparateButton: true });
			assert.ok(!map.zoomControl.getContainer().contains(separate.link));
		});
	});

	describe('Leaflet 1', { skip: isLeaflet2 }, () => {
		it('should invalidate map size on toggle', async() => {
			const control = mountControl();

			let invalidateCalled = 0;
			const originalInvalidateSize = map.invalidateSize;
			map.invalidateSize = function() {
				invalidateCalled++;
				return originalInvalidateSize.call(this);
			};

			await control.toggleFullScreen();
			assert.strictEqual(invalidateCalled, 1);

			await control.toggleFullScreen();
			assert.strictEqual(invalidateCalled, 2);
		});
	});

	describe('Leaflet 2', { skip: !isLeaflet2 }, () => {
		it('should build on the built-in FullscreenControl', () => {
			const control = mountControl({
				title: 'Enter map',
				titleCancel: 'Leave map',
				forcePseudoFullscreen: true
			});

			assert.ok(control instanceof Leaflet.FullscreenControl);
			assert.strictEqual(control.options.enterTitle, 'Enter map');
			assert.strictEqual(control.options.exitTitle, 'Leave map');
			assert.strictEqual(control.options.pseudo, true);
		});

		it('should fire both the core and the plugin events', async() => {
			const control = mountControl({ forcePseudoFullscreen: true });
			const fired = [];
			map.on('enterfullscreen enterFullscreen exitfullscreen exitFullscreen', ({ type }) => fired.push(type));

			await control.toggleFullScreen();
			await control.toggleFullScreen();

			assert.deepStrictEqual(fired.sort(), ['enterFullscreen', 'enterfullscreen', 'exitFullscreen', 'exitfullscreen']);
		});
	});

	describe('Cleanup', () => {
		it('should remove event listeners on onRemove', () => {
			const control = mountControl();

			assert.ok(control.link);

			map.removeControl(control);

			// If no errors thrown, cleanup was successful
			assert.ok(true);
		});
	});
});
