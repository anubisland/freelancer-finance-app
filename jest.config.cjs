/**
 * Baseline Jest config for freelancer-finance-app.
 *
 * Phase 0 (this PR): `ts-jest` for TypeScript smoke tests. The React Native
 * Jest preset depends on `react-native` itself being installed; that lands
 * with the RN scaffold in the Phase 1 implementation issue, at which point
 * `preset` should be flipped to `react-native`.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx,js,jsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  clearMocks: true,
};
