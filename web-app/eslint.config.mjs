// web-app/eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Tidak perlu options seperti 'useEslintrc' di sini untuk flat config
});

const eslintConfig = [
  // next/core-web-vitals sudah mencakup banyak aturan
  ...compat.extends("next/core-web-vitals"),
  // next/typescript mungkin tidak perlu diexplicitly extends jika sudah dicakup oleh core-web-vitals
  // atau jika konflik. Untuk saat ini, kita bisa coba versi yang lebih sederhana.
];

export default eslintConfig;