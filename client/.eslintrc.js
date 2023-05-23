module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: ['plugin:vue/essential', 'standard'],
  globals: {
    API_BASE_URL: true,
    BUGSNAG_CLIENT_KEY: true,
    DEFAULT_PROGRAM_IMAGE: true,
    DEFAULT_TEMPLATE_IMAGE: true,
    DEFAULT_COMPANY_IMAGE: true,
    DEFAULT_USER_IMAGE: true,
    RECAPTCHA_SITE_KEY: true,
    VUE_APP_TITLE: true,
  },
  plugins: ['vue'],
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'generator-star-spacing': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'ignore',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? 'error' : 'off',
    'no-extra-semi': 'error',
    indent: 0,
    'eslint-disable-next-line': 'off',
    'no-trailing-spaces': 'off',
    'space-before-function-paren': 'off',
    'space-before-blocks': 'off',
  },
}
