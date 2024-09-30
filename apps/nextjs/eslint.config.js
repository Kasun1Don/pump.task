import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import baseConfig from "@acme/eslint-config/base";
import nextjsConfig from "@acme/eslint-config/nextjs";
import reactConfig from "@acme/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   plugins: {
  //     "@typescript-eslint": tsPlugin,
  //   },
  //   languageOptions: {
  //     parser: tsParser,
  //     parserOptions: {
  //       project: "./tsconfig.json",
  //       tsconfigRootDir: ".",
  //       allowDefaultProject: true,
  //     },
  //   },
  // },
];
