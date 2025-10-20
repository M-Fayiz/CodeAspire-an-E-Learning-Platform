module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true, // Enables Node.js global variables and ESLint rules
    es2021: true,
  },
  rules: {
    // Add or override specific ESLint rules here
  },
};
