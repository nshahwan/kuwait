/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-links. Base: cards. NO-IMAGE variant.
 * Source: https://moc.gov.kw/ar (.flex.flex-row.items-center.justify-center.gap-4.container)
 * Generated: 2026-08-17
 *
 * xwalk container block. Filter 'cards-links' -> child 'card' model whose only
 * field is 'text' (richtext). This is the cards "no images" variant recommended
 * by the convention when no images are present, so each card row has a single
 * text cell (no image cell) — matching the model exactly.
 * One row per link button.
 *
 * Each source item is an <a href> link button (text label + href).
 */
export default function parse(element, { document }) {
  const links = Array.from(element.querySelectorAll(':scope > a[href], a[href]'));

  const cells = [];
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const label = link.textContent.trim();
    if (!href && !label) return;

    // Single text cell: the link preserved exactly (Arabic label + href).
    const textCell = [document.createComment(' field:text ')];
    const a = document.createElement('a');
    if (href) a.setAttribute('href', href);
    a.textContent = label || href || '';
    textCell.push(a);
    cells.push([textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-links', cells });
  element.replaceWith(block);
}
