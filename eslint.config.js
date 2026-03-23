import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import css from '@eslint/css';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	globalIgnores(['dist/**']),
	{
		files: ['**/*.css'],
		language: 'css/css',
		extends: [css.configs.recommended],
		rules: { 'css/use-baseline': 'off', 'css/no-important': 'off' }
	},
	{
		files: ['**/*.js'],
		extends: [js.configs.recommended, stylistic.configs.all],
		languageOptions: {
			globals: globals.browser
		},
		rules: {
			'@stylistic/array-element-newline': ['error', 'consistent'],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error', 'only-multiline'],
			'@stylistic/dot-location': ['error', 'property'],
			'@stylistic/function-call-argument-newline': ['error', 'consistent'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/multiline-comment-style': 'off',
			'@stylistic/multiline-ternary': 'off',
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
			'@stylistic/padded-blocks': 'off',
			'@stylistic/quote-props': ['error', 'consistent-as-needed'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/space-before-function-paren': ['error', 'never'],
			'no-lonely-if': 'error',
			'no-unused-expressions': ['error', { allowTernary: true }]
		}
	},
	{
		files: ['spec/**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	}
]);
