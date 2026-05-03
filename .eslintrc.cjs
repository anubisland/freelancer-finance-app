/**
 * Baseline ESLint config for freelancer-finance-app.
 *
 * Phase 0 (this PR): TypeScript-aware linting only. Application code does not
 * exist yet, so no React/React Native source files are linted.
 *
 * Phase 1 (ANU-510 / RN scaffolding): swap in `@react-native/eslint-config`
 * once `react`, `react-native`, and the matching peer plugins are installed
 * as production dependencies.
 */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/', 'build/'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['__tests__/**/*.{ts,tsx,js,jsx}', '**/*.test.{ts,tsx,js,jsx}'],
      env: { jest: true },
    },
  ],
};
