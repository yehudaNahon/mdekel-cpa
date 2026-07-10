import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { LOCALES, isLocale, postSlug } from "../../i18n/config";

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
  const locale = context.params.lang;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const labels = {
    he: [
      "מאמרים | Myri Dekel CPA",
      "תובנות מעשיות בנושאי חשבונאות, מסים ופיננסים.",
    ],
    en: [
      "Articles | Myri Dekel CPA",
      "Practical accounting, tax, and financial perspectives.",
    ],
    fr: [
      "Articles | Myri Dekel CPA",
      "Articles pratiques en comptabilité, fiscalité et finance.",
    ],
  };
  const posts = (await getCollection("articles")).filter(
    (post) => post.data.locale === locale,
  );
  return rss({
    title: labels[locale][0],
    description: labels[locale][1],
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/${locale}/articles/${postSlug(post.id)}/`,
    })),
  });
}
