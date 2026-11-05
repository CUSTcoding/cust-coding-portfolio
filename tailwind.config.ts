import type { Config } from "tailwindcss";

// O visual do site vem do styles.css original (copiado sem alterações).
// O Tailwind entra com prefixo "tw-" e sem preflight para NÃO colidir com
// esse CSS (ex.: a classe ".hidden" do <header> é do site, não do Tailwind).
const config: Config = {
  prefix: "tw-",
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        cp: {
          cyan: "#00e5ff",
          pink: "#ff2a6d",
          bg: "#080b11",
        },
      },
    },
  },
  plugins: [],
};

export default config;
