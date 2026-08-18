/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-skyline. Base: hero.
 * Source: https://moc.gov.kw/ar (#high-impact-hero)
 * Generated: 2026-08-17
 *
 * Library convention (authoritative): 1 column, max 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (optional)
 *   Row 3: content — title / subheading / CTA (here: the overlaid badge label)
 *
 * xwalk field hints: image lands in row 2 (field:image; imageAlt collapses to
 * the <img alt="">). The overlaid 'الأخبار' news label is the badge, hinted in
 * the content cell (field:badge). The block JS defaults herolayout to the
 * asset-background 'overlay' style when unset, matching the full-bleed design.
 */
export default function parse(element, { document }) {
  // --- Background (skyline) image ---
  // Full-bleed skyline is the page-level fixed background image. Prefer any
  // image inside the hero, then fall back to the document background image.
  const bgImg = element.querySelector('img')
    || document.querySelector('img[alt="background image"], img[alt*="background" i]');

  // --- Badge label: the overlaid 'الأخبار' news label card heading ---
  const badgeEl = element.querySelector('h3[class*="bg-main-blue"]')
    || [...element.querySelectorAll('h3')].find((h) => h.textContent.trim().length > 0);
  const badgeText = badgeEl ? badgeEl.textContent.trim() : '';

  // --- Optional hero heading (none authored on this page) ---
  const heading = element.querySelector(':scope h1, :scope h2');

  const cells = [];

  // Row 2: background image (field:image). imageAlt collapses into <img alt="">.
  const imageCell = [];
  if (bgImg) {
    imageCell.push(document.createComment(' field:image '));
    const picture = bgImg.closest('picture');
    imageCell.push((picture || bgImg).cloneNode(true));
  }
  cells.push([imageCell]);

  // Row 3: content — optional heading (field:text) + badge label (field:badge).
  const contentCell = [];
  if (heading) {
    contentCell.push(document.createComment(' field:text '));
    contentCell.push(heading.cloneNode(true));
  }
  if (badgeText) {
    contentCell.push(document.createComment(' field:badge '));
    contentCell.push(document.createTextNode(badgeText));
  }
  cells.push([contentCell]);

  // Empty-block guard: nothing meaningful to render.
  if (!bgImg && !heading && !badgeText) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-skyline', cells });
  element.replaceWith(block);
}
