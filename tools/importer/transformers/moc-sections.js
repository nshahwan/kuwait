/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MOC Kuwait (moc.gov.kw) section breaks.
 * Inserts an <hr> before each non-first section defined in
 * page-templates.json, producing EDS section boundaries between the 4 content
 * sections (hero, news, e-services, important-links).
 *
 * All 4 sections have style === null, so NO Section Metadata blocks are emitted
 * (expected metadata count = 0). Expected <hr> count = sections.length - 1 = 3.
 *
 * Follows the reference implementation: breaks are inserted in beforeTransform
 * (while every section element still exists, before block parsers may replace
 * them) using reverse iteration so that inserting relative to a live element
 * never shifts sections not yet processed. A marker attribute anchors any
 * styled section's metadata in afterTransform — retained here for correctness
 * even though no section is styled on this page.
 *
 * Section selectors come directly from page-templates.json (DOM-verified
 * boundaries): #high-impact-hero, .swiper-wrapper, .grid.grid-cols-2,
 * .flex.flex-row.items-center.justify-center.gap-4.container.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Emit Section Metadata for any styled section, anchored to the marker <hr>
    // (or the surviving original element). No section is styled on this page, so
    // this loop is a no-op here; kept for correctness / future styled sections.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove();
      }
    }
  }
}
