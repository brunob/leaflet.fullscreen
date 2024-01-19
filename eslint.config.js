const globals = require('globals');
const eslintPluginEslint = require('@eslint/js');
const eslintPluginStylistic = require('@stylistic/eslint-plugin');

const config = [
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				define: 'readonly',
				L: 'writable'
			}
		},
		plugins: {
			...eslintPluginStylistic.configs['recommended-flat'].plugins
		},
		rules: {
			...eslintPluginEslint.configs['recommended'].rules,
			...eslintPluginStylistic.configs['recommended-flat'].rules,
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error', 'only-multiline'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/no-tabs': 'off',
			'@stylistic/semi': ['error', 'always'],
			'no-lonely-if': 'error',
			'no-unused-expressions': ['error', { allowTernary: true }]
		}
	}
];

module.exports = config;
