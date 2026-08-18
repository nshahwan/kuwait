/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MOC Kuwait (moc.gov.kw) site-wide cleanup.
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against captured cleaned.html.
 *
 * RTL Arabic page (dir=rtl, lang=ar) — no text is modified; Arabic content is
 * preserved exactly. This transformer only removes shell/decorative elements.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // The news list (.swiper-wrapper, ~40 items) is nested INSIDE the hero
    // (#high-impact-hero). If left there, the hero-skyline parser replaces the
    // hero and detaches the news subtree before cards-news can parse it. Relocate
    // the news list to be a sibling immediately after the hero so both the hero
    // and the news list survive as independent, parseable sections.
    const hero = element.querySelector('#high-impact-hero');
    const newsList = element.querySelector('.swiper-wrapper');
    if (hero && newsList && hero.contains(newsList)) {
      hero.after(newsList);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Header / nav + everything inside it (search buttons, language switcher,
      // date/time strip, logo). Migrated separately — cleaned.html L7.
      'header',
      // Footer (social links, copyright). Migrated separately — cleaned.html L585.
      'footer',
      // Decorative fixed full-page background image — cleaned.html L4.
      'img[alt="background image"]',
      // Decorative header background image (sits above <header>) — cleaned.html L6.
      'img[alt="header-bg"]',
      // Floating chatbot launcher (the fixed "اسألني" element) — cleaned.html L607.
      '.fixed.bottom-6.right-6',
      // Toast top container (empty runtime shell) — cleaned.html L620.
      '.fixed.top-4',
      // Toast notification list (empty runtime shell) — cleaned.html L623.
      'ol.fixed',
      // Next.js route announcer (a11y runtime element) — cleaned.html L626.
      'next-route-announcer',
      // Decorative background <video> duplicates (mobile + desktop) and their
      // <source> children, between hero/news and e-services — cleaned.html L492/L497.
      'video',
      'source',
    ]);
  }
}
