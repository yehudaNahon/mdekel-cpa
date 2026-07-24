import eslintParserTypeScript from "@typescript-eslint/parser";
import * as eslintParserAstro from "astro-eslint-parser";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import { defineConfig } from "eslint/config";

const arbitraryColorPattern = [
  "^(?:[A-Za-z0-9_@\\[\\]&*().,/%#-]+:)*",
  "(?:(?:border|divide)-[trblxyse]|ring-offset|inset-shadow|drop-shadow|",
  "accent|bg|border|caret|decoration|divide|fill|from|outline|",
  "placeholder|ring|shadow|stroke|text|to|via)-",
  "\\[(?!(?:angle|image|length|number|percentage|url):)",
  "(?:[^\\]]*#[\\da-fA-F]{3,8}|",
  "[^\\]]*(?:color|color-mix|conic-gradient|hsl|hsla|hwb|lab|lch|",
  "light-dark|linear-gradient|oklab|oklch|radial-gradient|rgb|rgba|var)\\(|",
  "[A-Za-z]+)\\](?:/[^\\s]+)?$",
].join("");

export default defineConfig([
  {
    ignores: [".astro/**", "dist/**", "src/paraglide/**"],
  },
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      parser: eslintParserAstro,
      parserOptions: {
        parser: eslintParserTypeScript,
      },
    },
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      "better-tailwindcss/no-restricted-classes": [
        "error",
        {
          restrict: [
            {
              message:
                "Use an approved Tailwind color token instead of an arbitrary color.",
              pattern: arbitraryColorPattern,
            },
          ],
        },
      ],
      "better-tailwindcss/no-unknown-classes": "error",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/styles/global.css",
        selectors: [
          ...getDefaultSelectors(),
          {
            kind: "attribute",
            match: [{ type: "strings" }],
            name: "^class:list$",
          },
        ],
      },
    },
  },
]);
