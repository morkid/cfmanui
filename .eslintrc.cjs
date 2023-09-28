/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    },
    {
      files: [
        '**/*.{vue,cjs,js,ts,jsx,tsx}',
      ],
      rules: {
        indent: ['error', 2],
        quotes: ['error', 'single'],
        'quote-props': ['error', 'as-needed', { keywords: true }],
        semi: ['error', 'never'],
      }
    }
  ],
  ignorePatterns: [
    'cypress.config.js',
    'dist/**/*',
    'index.js',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
