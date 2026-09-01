import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En GitHub Actions, GITHUB_REPOSITORY vale "usuario/repositorio".
// Así la base se ajusta sola a /repositorio/ al publicar en GitHub Pages
// y se queda en / cuando trabajas en local.
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  plugins: [react()],
  base: repo ? `/${repo}/` : "/",
});
