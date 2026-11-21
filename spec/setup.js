import { Window } from 'happy-dom';

// Setup happy-dom as global DOM environment
const window = new Window({
	url: 'https://localhost:3000'
});

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.Node = window.Node;

// Browser APIs that Leaflet 2 needs but happy-dom doesn't expose globally
global.getComputedStyle = window.getComputedStyle.bind(window);
global.ResizeObserver = window.ResizeObserver || class {
	observe() {}

	unobserve() {}

	disconnect() {}
};
global.requestAnimationFrame = window.requestAnimationFrame?.bind(window) ??
  ((callback) => setTimeout(() => callback(Date.now()), 0));
global.cancelAnimationFrame = window.cancelAnimationFrame?.bind(window) ?? clearTimeout;

// Browsers fire fullscreenchange on the element and on the document
const setFullscreenElement = (element) => {
	const previous = document.fullscreenElement;
	document.fullscreenElement = element;
	(element ?? previous)?.dispatchEvent(new window.Event('fullscreenchange'));
	document.dispatchEvent(new window.Event('fullscreenchange'));
};

// Mock Fullscreen API (not supported in happy-dom)
HTMLElement.prototype.requestFullscreen = async function() {
	setFullscreenElement(this);
};

document.exitFullscreen = async function() {
	setFullscreenElement(null);
};

// Simulates the user leaving fullscreen with ESC or the browser UI
export function exitFullscreenExternally() {
	setFullscreenElement(null);
}

Object.defineProperty(document, 'fullscreenElement', {
	value: null,
	writable: true,
	configurable: true
});

Object.defineProperty(document, 'fullscreenEnabled', {
	value: true,
	writable: false
});
