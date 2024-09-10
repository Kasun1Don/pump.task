/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config/web";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        // Add your custom color without removing existing ones
        "zesty-green": "var(--ZESTY-GREEN, #72D524)",
      },
    },
  },
} satisfies Config;
