module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: ["tsconfig.json", "packages/socket/tsconfig.json"],
  },
  extends: ["airbnb-typescript/base", "plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": ["error"],
    "default-case": ["off"],
    "no-use-before-define": ["off"],
    "@typescript-eslint/no-use-before-define": ["error", {functions: false}],
    "@typescript-eslint/no-unused-vars": ["warn", {args: "all", argsIgnorePattern: "^_"}],
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "no-shadow": 0,
    "no-underscore-dangle": "off",
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
      },
    ],
    "no-useless-concat": 0,
    "prefer-template": "warn",
    "import/prefer-default-export": "warn",
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: false,
      },
    ],
  },
};
