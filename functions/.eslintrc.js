module.exports = {
  root: true,
  parserOptions: {ecmaVersion: 2022},
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
  },
  plugins: ["prettier"],
};
