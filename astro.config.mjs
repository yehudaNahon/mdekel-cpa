// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  i18n: {
    defaultLocale: "he",
    locales: ["he", "en", "fr"],
    routing: "manual",
  },
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: [
          "url",
          "cookie",
          "preferredLanguage",
          "globalVariable",
          "baseLocale",
        ],
        urlPatterns: [
          {
            pattern: "/",
            localized: [
              ["he", "/he/"],
              ["en", "/en/"],
              ["fr", "/fr/"],
            ],
          },
          {
            pattern: "/:path(.*)?",
            localized: [
              ["he", "/he/:path(.*)?"],
              ["en", "/en/:path(.*)?"],
              ["fr", "/fr/:path(.*)?"],
            ],
          },
        ],
      }),
      tailwindcss(),
    ],
  },
});
