export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [0, 'always'],
		'body-max-line-length': [0, 'always']
	}
};
