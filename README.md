# Myri Dekel CPA Website

An English-first CPA marketing site built with Astro 5, Tailwind CSS 4, and the Cloudflare Workers adapter. Business names and contact details are working placeholders and must be verified before launch.

## Asset credits

- Founder portraits in `src/assets/headshots/` were supplied with the project.
- `public/images/financial-desk.jpg`: [Cht Gsml on Unsplash](https://unsplash.com/photos/desk-with-calculator-binders-notebook-and-glasses--6LEDthF1AI), used under the Unsplash License.
- `public/images/planning-session.jpg`: [Scott Graham on Unsplash](https://unsplash.com/photos/person-holding-pencil-near-laptop-computer-OQMZwNd3ThU), used under the Unsplash License.
- `public/images/business-purchase.jpg`: [Surface on Unsplash](https://unsplash.com/photos/a-black-laptop-next-to-a-couple-of-books-and-a-calculator-exSKJMg-_vI), used under the Unsplash License.
- `public/images/cash-flow-dashboard.jpg`: [Carlos Muza on Unsplash](https://unsplash.com/photos/hpjSkU2UYSU), used under the Unsplash License.
- `public/images/tax-planning.jpg`: [Kelly Sikkema on Unsplash](https://unsplash.com/photos/3-Tc_5LROrM), used under the Unsplash License.

The local Atkinson font files are inherited from the original Astro blog starter.
The locally bundled Noto Sans Hebrew and Noto Serif Hebrew files are provided by Google Fonts under the SIL Open Font License.

## Development

Install dependencies with `npm install`, then use the scripts below.

| Command                           | Action                                          |
| :-------------------------------- | :---------------------------------------------- |
| `npm run dev`                     | Start the local Astro development server        |
| `npm run build`                   | Build the production site                       |
| `npm run check`                   | Build, type-check, and run a Cloudflare dry-run |
| `npm run preview`                 | Build and preview through Wrangler              |
| `npm run deploy`                  | Deploy to Cloudflare Workers                    |

## Before launch

- Replace the placeholder email, phone, location, and biography with verified details.
- Connect the disabled contact form to an approved secure form service.
- Update the canonical `site` URL in `astro.config.mjs`.
- Review all accounting and tax copy for the intended jurisdiction.
