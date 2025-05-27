import { FlatCompat } from "@eslint/eslintrc";
import nodePlugin from "eslint-plugin-n";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      n: nodePlugin,
    },
    rules: {
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "quotes": ["error", "double"],
      "n/no-process-env": "error",
    }
  }
];

export default eslintConfig;
