/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-service. Base: cards.
 * Source: https://moc.gov.kw/ar (.grid.grid-cols-2)
 * Generated: 2026-08-17
 *
 * xwalk container block. Filter 'cards-service' -> child 'card' model with
 * fields: image, imageAlt (collapses to <img alt="">), text (richtext).
 * Per the Cards convention: each card row = [image cell, text cell].
 * One row per tile. If a cell is empty it is still included.
 *
 * Each source tile is an anchor:
 *   a.group.relative.grid.grid-cols-1[href]
 *     picture > img   (tile image)
 *     h3              (label)
 * The whole tile is clickable, so the label is wrapped in the tile link.
 */
export default function parse(element, { document }) {
  const tiles = Array.from(
    element.querySelectorAll(':scope > a[href], a.group[href]'),
  );

  const cells = [];
  tiles.forEach((tile) => {
    const href = tile.getAttribute('href');
    const img = tile.querySelector('picture > img, img');
    const labelEl = tile.querySelector('h3');
    const label = labelEl ? labelEl.textContent.trim() : '';
    if (!href && !img && !label) return;

    // Cell 1 — image (field:image). imageAlt collapses into <img alt="">.
    // Included even if empty, per the Cards convention.
    const imageCell = [];
    if (img) {
      imageCell.push(document.createComment(' field:image '));
      const picture = img.closest('picture');
      imageCell.push((picture || img).cloneNode(true));
    }

    // Cell 2 — text (field:text): label wrapped in the tile link.
    const textCell = [document.createComment(' field:text ')];
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = label || href;
      textCell.push(a);
    } else if (label) {
      textCell.push(document.createTextNode(label));
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
