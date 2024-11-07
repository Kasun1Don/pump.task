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
      textColor: {
        "zesty-green": "#72D524",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      borderWidth: {
        1: "0.5px",
      },
      gap: {
        0.5: "2px",
      },
      colors: {
        "zesty-green": "#72D524",
        "labrys-s": "#ffff00",
        "labrys-y": "#d8ff00",
        "labrys-r": "#5bffa7",
        "labrys-b": "#71ffe0",
        "labrys-a": "#00ffa7",
        "labrys-l": "#00ffd3",
      },
      height: {
        "h-2.5": "10px",
      },
      width: {
        "w-2.5": "10px",
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
