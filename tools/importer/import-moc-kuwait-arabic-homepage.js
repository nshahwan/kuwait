/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSkylineParser from './parsers/hero-skyline.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsLinksParser from './parsers/cards-links.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/moc-cleanup.js';
import sectionsTransformer from './transformers/moc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-skyline': heroSkylineParser,
  'cards-news': cardsNewsParser,
  'cards-service': cardsServiceParser,
  'cards-links': cardsLinksParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'MOC Kuwait Arabic Homepage',
  description:
    "RTL (dir=rtl, lang=ar) Ministry of Communications Kuwait Arabic homepage. Main content: a full-bleed skyline hero with an overlaid 'الأخبار' news label card, a ~40-item news list, a 4-tile e-services grid (الخدمات الإلكترونية), and a 6-button important-links row (الروابط المهمة). Header/nav and footer are migrated separately.",
  urls: ['https://moc.gov.kw/ar'],
  blocks: [
    {
      name: 'hero-skyline',
      instances: ['#high-impact-hero'],
    },
    {
      name: 'cards-news',
      instances: ['.swiper-wrapper'],
    },
    {
      name: 'cards-service',
      instances: ['.grid.grid-cols-2'],
    },
    {
      name: 'cards-links',
      instances: ['.flex.flex-row.items-center.justify-center.gap-4.container'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero — Kuwait skyline with News label card',
      selector: '#high-impact-hero',
      style: null,
      blocks: ['hero-skyline'],
      defaultContent: [],
    },
    {
      id: 'section-news',
      name: 'News list (الأخبار)',
      selector: '.swiper-wrapper',
      style: null,
      blocks: ['cards-news'],
      defaultContent: [],
    },
    {
      id: 'section-eservices',
      name: 'E-Services grid (الخدمات الإلكترونية)',
      selector: '.grid.grid-cols-2',
      style: null,
      blocks: ['cards-service'],
      defaultContent: ['h2:has(> span)'],
    },
    {
      id: 'section-important-links',
      name: 'Important links (الروابط المهمة)',
      selector: '.flex.flex-row.items-center.justify-center.gap-4.container',
      style: null,
      blocks: ['cards-links'],
      defaultContent: ['h2:has(> span)'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks (only when 2+ sections)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Map root URL to /index to avoid the bundled
    //    importer's empty-path crash.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
