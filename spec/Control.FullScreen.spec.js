import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import './setup.js';
import { Map } from 'leaflet';

// Import after setup (Fullscreen API is mocked)
const { FullScreen } = await import('../src/Control.FullScreen.js');

describe('FullScreen Control', () => {
	let map;

	beforeEach(() => {
		map = new Map(document.createElement('div'));
		document.body.innerHTML = '';
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
	});

	describe('DOM Creation', () => {
		it('should create DOM elements when added to map', () => {
			const control = new FullScreen();
			control._map = map;
			const container = control.onAdd(map);

			assert.ok(container instanceof HTMLElement, 'Should return an HTML element');
			assert.ok(container.querySelector('a'), 'Should contain a link element');
		});

		it('should support custom content in button', () => {
			const control = new FullScreen({
				content: '<span>FS</span>'
			});
			control._map = map;
			const container = control.onAdd(map);
			const link = container.querySelector('a');

			assert.ok(link, 'Link should exist');
			assert.strictEqual(control.options.content, '<span>FS</span>');
		});

		it('should create separate button when forceSeparateButton is true', () => {
			const control = new FullScreen({
				forceSeparateButton: true
			});
			control._map = map;
			const container = control.onAdd(map);

			assert.ok(container.classList.contains('leaflet-bar'));
		});
	});

	describe('Accessibility (ARIA)', () => {
		it('should set aria attributes on button', () => {
			const control = new FullScreen();
			control._map = map;
			const container = control.onAdd(map);
			const link = container.querySelector('a');

			assert.strictEqual(link.getAttribute('role'), 'button');
			assert.ok(link.hasAttribute('aria-label'));
		});

		it('should set aria-pressed when entering fullscreen', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);
			const link = control.link;

			await control.toggleFullScreen();
			assert.strictEqual(link.getAttribute('aria-pressed'), 'true');
		});

		it('should update aria-pressed when exiting fullscreen', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);
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
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);
		});

		it('should toggle fullscreen state', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);

			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, false);
		});

		it('should toggle CSS class on state change', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);
			const link = control.link;

			assert.ok(!link.classList.contains('leaflet-fullscreen-on'));

			await control.toggleFullScreen();
			assert.ok(link.classList.contains('leaflet-fullscreen-on'));

			await control.toggleFullScreen();
			assert.ok(!link.classList.contains('leaflet-fullscreen-on'));
		});

		it('should update title when toggling', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);
			const link = control.link;

			assert.strictEqual(link.title, 'Full Screen');

			await control.toggleFullScreen();
			assert.strictEqual(link.title, 'Exit Full Screen');

			await control.toggleFullScreen();
			assert.strictEqual(link.title, 'Full Screen');
		});

		it('should invalidate map size on toggle', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

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

	describe('Events', () => {
		it('should fire enterFullscreen event', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			let eventFired = false;
			map.on('enterFullscreen', () => {
				eventFired = true;
			});

			await control.toggleFullScreen();
			assert.ok(eventFired, 'enterFullscreen event should be fired');
		});

		it('should fire exitFullscreen event on toggle off', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			let exitEventFired = false;
			map.on('exitFullscreen', () => {
				exitEventFired = true;
			});

			await control.toggleFullScreen();
			await control.toggleFullScreen();

			assert.ok(exitEventFired);
		});

		it('should handle external fullscreen exit', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			let exitEventFired = false;
			map.on('exitFullscreen', () => {
				exitEventFired = true;
			});

			// Enter fullscreen
			await control.toggleFullScreen();
			assert.strictEqual(map._isFullscreen, true);

			// Simulate browser ESC key (external exit)
			map._exitFired = false;
			control._handleFullscreenChange();

			assert.strictEqual(map._isFullscreen, false);
			assert.ok(exitEventFired);
		});
	});

	describe('Options & Features', () => {
		it('should use pseudo-fullscreen when forcePseudoFullscreen is true', async() => {
			const control = new FullScreen({
				forcePseudoFullscreen: true
			});
			control._map = map;
			control.onAdd(map);

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
			const control = new FullScreen({
				fullscreenElement: customElement,
				forcePseudoFullscreen: true
			});
			control._map = map;
			control.onAdd(map);

			await control.toggleFullScreen();
			assert.ok(customElement.classList.contains('leaflet-pseudo-fullscreen'));

			await control.toggleFullScreen();
			assert.ok(!customElement.classList.contains('leaflet-pseudo-fullscreen'));
		});

		it('should provide map.fullscreenControl reference', async() => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			assert.ok(control.toggleFullScreen);
			assert.ok(map.fullscreenControl);
			assert.strictEqual(map.fullscreenControl, control);
		});
	});

	describe('Cleanup', () => {
		it('should remove event listeners on onRemove', () => {
			const control = new FullScreen();
			control._map = map;
			control.onAdd(map);

			assert.ok(control.link);

			control.onRemove();

			// If no errors thrown, cleanup was successful
			assert.ok(true);
		});
	});
});
