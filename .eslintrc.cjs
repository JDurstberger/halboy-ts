/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@stylistic/js'],
  root: true,
  rules: {
    '@stylistic/js/nonblock-statement-body-position': ['error', 'below'],
  },
}
