import { copyFileSync } from 'fs';

export default {
	input: 'src/Control.FullScreen.js',
	external: ['leaflet'],
	output: [
		{
			file: 'dist/Control.FullScreen.js',
			format: 'es',
			banner: `/*!
 * leaflet.fullscreen
 * (c) Bruno B.; MIT License
 * https://github.com/brunob/leaflet.fullscreen
 */
/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */`,
			sourcemap: false
		},
		{
			file: 'dist/Control.FullScreen.umd.js',
			format: 'umd',
			name: 'L.Control.FullScreen',
			globals: {
				leaflet: 'L'
			},
			banner: `/*!
 * leaflet.fullscreen
 * (c) Bruno B.; MIT License
 * https://github.com/brunob/leaflet.fullscreen
 */
/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */`,
			sourcemap: false
		}
	],
	plugins: [
		{
			name: 'copy-assets',
			buildEnd() {
				copyFileSync('src/Control.FullScreen.css', 'dist/Control.FullScreen.css');
			}
		}
	]
};
