// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Myri Dekel CPA";
export const SITE = {
  name: SITE_TITLE,
  email: "mdekel.cpa@gmail.com",
  whatsappNumber: "972508430072",
  whatsappDisplay: "050-843-0072",
};

export const whatsappHref = (message: string): string =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const NAV_PATHS = ["/", "/about/", "/services/", "/articles/"] as const;
