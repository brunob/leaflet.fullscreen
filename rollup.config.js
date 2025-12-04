import { copyFileSync } from 'fs';

const banner = `/*!
 * leaflet.fullscreen
 * (c) Bruno B.; MIT License
 * https://github.com/brunob/leaflet.fullscreen
 */
/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */`;

export default [
	// ESM build (supports named and default exports)
	{
		input: 'src/Control.FullScreen.js',
		external: ['leaflet'],
		output: {
			file: 'dist/Control.FullScreen.js',
			format: 'es',
			banner,
			sourcemap: false
		},
		plugins: [
			{
				name: 'copy-assets',
				buildEnd() {
					copyFileSync('src/Control.FullScreen.css', 'dist/Control.FullScreen.css');
				}
			}
		]
	},
	// UMD build (uses separate entry for clean default export → L.Control.FullScreen)
	{
		input: 'src/umd-entry.js',
		external: ['leaflet'],
		output: {
			file: 'dist/Control.FullScreen.umd.js',
			format: 'umd',
			name: 'L.Control.FullScreen',
			exports: 'default',
			globals: {
				leaflet: 'L'
			},
			banner,
			sourcemap: false
		}
	}
];
