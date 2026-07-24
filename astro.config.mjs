// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

import cloudflare from "@astrojs/cloudflare";

const locales = ["he", "en", "fr"];
const legacyArticleSlugs = [
  "first-post",
  "markdown-style-guide",
  "second-post",
  "third-post",
  "using-mdx",
];
const legacyArticleRedirects = Object.fromEntries(
  locales.flatMap((locale) => [
    [`/${locale}/blog`, { destination: `/${locale}/articles`, status: 301 }],
    ...legacyArticleSlugs.map((slug) => [
      `/${locale}/blog/${slug}`,
      { destination: `/${locale}/articles/${slug}`, status: 301 },
    ]),
  ]),
);

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  redirects: legacyArticleRedirects,
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
        strategy: ["url", "cookie", "globalVariable", "baseLocale"],
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
