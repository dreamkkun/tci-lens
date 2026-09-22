import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F0",
        ink: "#16161D",
        line: "#EADFD0",
        navy: "#0F172A",
        coral: { DEFAULT: "#E5484D", soft: "#FFE4E4", line: "#F4A9AD" },
        honey: { soft: "#FFF0C7", line: "#F0CF6B", ink: "#7A5200" },
        peach: { soft: "#FFEBD2", line: "#F6C58E" },
        mint: { soft: "#E2F7EC", line: "#93DDB7", ink: "#137A4A" },
        temperament: { DEFAULT: "#E5484D", light: "#F4A9AD" },
        character: { DEFAULT: "#16161D", light: "#9CA3AF" },
      },
    },
  },
  plugins: [],
};

export default config;
