const js = require('@eslint/js');
const globals = require('globals');
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

// eslint-config-next, eslint-plugin-react, eslint-plugin-react-hooks and
// eslint-plugin-jsx-a11y (at the versions pinned here, matching next@15)
// don't ship their own flat-config exports yet - FlatCompat translates their
// legacy `extends` strings the same way ESLint 8 itself resolved them.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Whitelisted to the actual source roots (app code + root-level config
// files) rather than '**/*.ext' + an ignore list for everything else - the
// working tree also holds untracked, non-source content (abandoned/
// alternate spike directories with their own build output, editor/tool
// dirs, etc.) that a blacklist would need to keep enumerating by hand as it
// grows. Anything outside these roots is simply never matched by any
// config block below, so it's never linted - no ignores list needed.
const jsFiles = ['src/**/*.js', 'src/**/*.jsx', 'cypress/**/*.js', '*.js'];
const tsFiles = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'cypress/**/*.ts',
  'cypress/**/*.tsx',
  '*.ts',
];

const allFiles = [...jsFiles, ...tsFiles];

module.exports = [
  // `files` on each config below scopes which *rules* apply to which
  // files, but doesn't stop ESLint from walking (and partially processing,
  // e.g. validating inline eslint-disable comments against the full
  // registered rule set) files outside that scope entirely. This is the
  // actual whitelist: ignore everything, then un-ignore only the real
  // source roots - the one way to keep ESLint from touching anything else
  // (abandoned/alternate spike directories, editor/tool dirs, etc.) at all.
  {
    ignores: [
      '**/*',
      '!src/**',
      '!cypress/**',
      '!*.js',
      '!*.ts',
      '!*.jsx',
      '!*.tsx',
    ],
  },
  { ...js.configs.recommended, files: allFiles },
  { ...prettierRecommended, files: allFiles },
  {
    files: allFiles,
    rules: {
      // Override prettier/recommended to show errors as warnings.
      'prettier/prettier': ['warn'],
    },
  },
  ...compat
    .extends(
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:@next/next/recommended'
    )
    .map((config) => ({ ...config, files: jsFiles })),
  {
    files: jsFiles,
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // This rule is not compatible with Next.js's <Link /> components
      'jsx-a11y/anchor-is-valid': 'off',

      // Warn about unused variables
      'no-unused-vars': 'warn',

      // No need to import React when using Next.js
      'react/react-in-jsx-scope': 'off',
    },
  },
  // This configuration will apply only to TypeScript files
  ...compat
    .extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended'
    )
    .map((config) => ({ ...config, files: tsFiles })),
  {
    files: tsFiles,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2019,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015,
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // This rule is not compatible with Next.js's <Link /> components
      'jsx-a11y/anchor-is-valid': 'off',

      // Disable display-name errors in static layout trees
      'react/display-name': 'off',

      // We will use TypeScript's types for component props instead
      'react/prop-types': 'off',

      // No need to import React when using Next.js
      'react/react-in-jsx-scope': 'off',

      // Warn about unused variables (ignore middle vars)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', args: 'after-used' },
      ],

      // Require return types on functions only where useful
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],

      // `interface X extends Y {}` (no added members) is the standard
      // pattern for converting a computed type alias into a mergeable/
      // augmentable interface (e.g. react-i18next's own documented typed-
      // resources setup) - only bare `interface X {}` is worth flagging.
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },
];
