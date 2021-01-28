module.exports = {
  extends: ['react-app', 'plugin:react-hooks/recommended'],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      plugins: ['react', '@typescript-eslint', 'jest'],
      env: {
        browser: true,
        es6: true,
        jest: true,
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: {
        'linebreak-style': 'off',
        // 'prettier/prettier': [
        //   'error',
        //   {
        //     singleQuote: true,
        //     endOfLine: 'auto',
        //   },
        // ],
      },
    },
  ],
};
