import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@acme/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.6rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        "zesty-green": "#72D524",
      },
      backgroundImage: {
        "custom-bg": "url('/Background.svg')", // custom background image
      },
      backgroundColor: {
        "zesty-green": "#72D524",
      },
      maxHeight: {
        "1/2": "50%",
      },
    },
  },
} satisfies Config;
