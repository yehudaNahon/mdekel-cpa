# AGENTS.md

This file gives coding agents the project-specific context needed to work safely
and consistently in this repository.

## Project overview

This is the multilingual marketing site for Myri Dekel CPA. It uses:

- Astro 5 with TypeScript
- Tailwind CSS 4 through the Vite plugin
- Paraglide JS for localized UI messages
- Markdown and MDX content collections for articles
- The Cloudflare Workers adapter and Wrangler

The supported locales are Hebrew (`he`), English (`en`), and French (`fr`).
Hebrew is the default locale and is rendered right-to-left.

## Common commands

Use Node.js 22 or newer and npm.

```sh
npm install
npm run dev
npm run format:check
npm run build
npm run check
```

`npm run check` is the main validation command. It builds the site, runs the
TypeScript compiler, and performs a Cloudflare deployment dry run. Run it after
code or configuration changes. For documentation-only changes, formatting
checks are sufficient.

Do not run `npm run deploy` unless the user explicitly asks for a deployment.

## Repository map

- `src/pages/[lang]/`: localized routes; every public page lives below a locale
  prefix
- `src/components/`: reusable Astro components
- `src/layouts/`: shared site and article layouts
- `src/i18n/config.ts`: locale types, URL helpers, and text direction
- `messages/{he,en,fr}.json`: Paraglide UI copy
- `src/content/blog/`: localized Markdown and MDX articles
- `src/content.config.ts`: article frontmatter schema
- `src/styles/global.css`: Tailwind theme tokens, fonts, and global styles
- `src/middleware.ts`: locale detection and legacy redirects
- `astro.config.mjs`: Astro, Paraglide, sitemap, redirects, and Cloudflare setup
- `public/`: files served unchanged
- `src/assets/`: images processed by Astro

`src/paraglide/`, `.astro/`, and `dist/` are generated outputs. Do not edit them
by hand.

## Implementation conventions

- Follow the existing Astro component style and keep TypeScript strict.
- Prefer reusable components for repeated UI; keep page-specific composition in
  `src/pages/`.
- Use `localePath()` for internal links. Do not hard-code a locale prefix.
- Validate route parameters with `isLocale()` and derive static locale routes
  from `LOCALES`.
- Use logical CSS properties and Tailwind utilities such as `ms`, `me`, `start`,
  and `end` so layouts work in both LTR and RTL directions.
- Reuse the design tokens defined in `src/styles/global.css` instead of adding
  arbitrary colors or shadows.
- Use Astro's `<Image>` component for imported images that should be optimized.
  Keep stable public URLs in `public/` when direct URLs are required.
- Preserve trailing slashes in internal canonical paths and localized links.
- Format supported files with Prettier; avoid unrelated formatting churn.

## Internationalization

- Visible interface copy belongs in the Paraglide message catalogs, not inline
  in Astro templates.
- Keep the same message keys in `messages/he.json`, `messages/en.json`, and
  `messages/fr.json`. When adding or removing a key, update all three catalogs.
- Import generated messages with
  `import { m } from "../paraglide/messages.js"` (adjusting the relative path as
  needed).
- Check Hebrew pages for correct RTL layout and natural Hebrew phrasing, not
  only literal translation.
- When adding a locale, update every locale source of truth, including
  `astro.config.mjs`, `src/i18n/config.ts`, the message catalogs, and localized
  article content.

## Articles

Articles use the `articles` collection and require this frontmatter:

```yaml
title: "..."
description: "..."
pubDate: "..."
locale: "he"
translationKey: "shared-key"
```

`updatedDate` and `heroImage` are optional. Store translated versions in the
matching locale directory and give translations the same `translationKey` and
slug. English articles currently live directly under `src/content/blog/`;
Hebrew and French live in `he/` and `fr/`.

Accounting and tax content is general information, not individualized advice.
Preserve or add an appropriate disclaimer when publishing substantive guidance.

## Content and launch safety

The repository still contains working placeholders. Do not invent or silently
replace business facts such as contact details, biography, credentials,
jurisdiction, or the canonical production domain. Use only details supplied or
verified by the user.

In particular:

- The contact form is intentionally disabled and must not appear to submit or
  store data until an approved secure service is connected.
- `astro.config.mjs` still uses `https://example.com` as the site URL.
- Professional, accounting, and tax claims require review for the intended
  jurisdiction before launch.
- Do not add secrets or sensitive client information to the repository.
- For external official calculators or regulatory resources, prefer primary
  government sources and preserve the existing disclaimer.

## Accessibility and metadata

- Preserve semantic landmarks, heading order, keyboard access, visible focus
  states, and the reduced-motion behavior in the global stylesheet.
- Give meaningful images localized alt text. Decorative images should use an
  empty alt value.
- External links that open a new tab must use `rel="noopener noreferrer"` and
  communicate that behavior accessibly.
- New pages should use `SiteLayout`, provide localized metadata, and maintain
  canonical and alternate-language links through the existing helpers.

## Verification

Before handing off a code change:

1. Run Prettier on the files you changed, or run `npm run format:check`.
2. Run `npm run check`.
3. For visual changes, inspect all three locales at representative mobile and
   desktop widths, with special attention to Hebrew RTL behavior.
4. Confirm that internal navigation, language switching, canonical URLs, and
   localized article filtering still work when affected.

Report any validation that could not be run and why.
