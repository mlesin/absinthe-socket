module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-use-before-define': ['off'],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-shadow': 0,
    'no-underscore-dangle': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
    'no-useless-concat': 0,
    'prefer-template': 'warn',
    'import/prefer-default-export': 'warn',
  },
  overrides: [
    {
      files: ['packages/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json', 'packages/socket/tsconfig.json'],
      },
      extends: ['airbnb-typescript/base', 'plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
      rules: {
        'default-case': ['off'],
        '@typescript-eslint/switch-exhaustiveness-check': ['error'],
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'all', argsIgnorePattern: '^_' }],
      },
    },
  ],
  ignorePatterns: ['**/dist/**'],
};
