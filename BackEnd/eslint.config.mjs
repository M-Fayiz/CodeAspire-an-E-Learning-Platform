import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: ["js"],
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.json"],
    plugins: ["json"],
    language: "json/json",
    extends: ["json/recommended"],
  },
]);
