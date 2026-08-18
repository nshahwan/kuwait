/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards. NO-IMAGE variant.
 * Source: https://moc.gov.kw/ar (.swiper-wrapper)
 * Generated: 2026-08-17
 *
 * xwalk container block. Filter 'cards-news' -> child 'card' model whose only
 * field is 'text' (richtext). This is the cards "no images" variant, so each
 * card row has a single text cell (no image cell) — matching the model.
 * One row per news item.
 *
 * Each source item is a .swiper-slide containing:
 *   - h3 > a  (headline + link)
 *   - p       (date)
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll(':scope > .swiper-slide, .swiper-slide'));

  const cells = [];
  slides.forEach((slide) => {
    const link = slide.querySelector('h3 a[href], a[href]');
    const date = slide.querySelector('p');
    if (!link && !date) return; // skip empty slides

    // Single text cell: linked headline + date (field:text richtext).
    const cardCell = [document.createComment(' field:text ')];
    if (link) {
      // Preserve the linked headline exactly (Arabic text + href).
      const heading = document.createElement('h3');
      heading.appendChild(link.cloneNode(true));
      cardCell.push(heading);
    }
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      cardCell.push(p);
    }
    cells.push([cardCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
