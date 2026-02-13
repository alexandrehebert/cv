import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  base: process.env.BASE_HREF || "/",
  output: "static",
  integrations: [tailwind()],
});
