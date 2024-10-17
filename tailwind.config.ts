import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
    extend: {
      spacing: {
        lg: "8rem",
        sm: "4rem",
      },
      fontFamily: {
        lora: ["lora", "sans-serif"],
        ibmplexsans: ["ibmplexsans", "sans-serif"],
      },
      colors: {
        "button-bg": "#C0C0C0",
        "button-text": "#000000",
        "text-color": "#C0C0C0",
        "text-gold": "#D8A261",
        "input-border": "#333333",
        "input-bg": "#151515",
        "input-color": "#BDBDBD",
        "error-message": "#FF0000",
      },
    },
  },
  plugins: [],
};

export default config;
