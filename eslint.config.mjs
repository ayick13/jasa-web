// web-app/eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // PERBAIKAN: Menonaktifkan aturan react/no-unescaped-entities secara global
      "react/no-unescaped-entities": "off", 
    },
  },
];

export default eslintConfig;