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

// Mock Fullscreen API (not supported in happy-dom)
HTMLElement.prototype.requestFullscreen = async function() {
	return Promise.resolve();
};

document.exitFullscreen = async function() {
	return Promise.resolve();
};

Object.defineProperty(document, 'fullscreenElement', {
	value: null,
	writable: true,
	configurable: true
});

Object.defineProperty(document, 'fullscreenEnabled', {
	value: true,
	writable: false
});
