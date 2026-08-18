/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-moc-kuwait-arabic-homepage.js
  var import_moc_kuwait_arabic_homepage_exports = {};
  __export(import_moc_kuwait_arabic_homepage_exports, {
    default: () => import_moc_kuwait_arabic_homepage_default
  });

  // tools/importer/parsers/hero-skyline.js
  function parse(element, { document: document2 }) {
    const bgImg = element.querySelector("img") || document2.querySelector('img[alt="background image"], img[alt*="background" i]');
    const badgeEl = element.querySelector('h3[class*="bg-main-blue"]') || [...element.querySelectorAll("h3")].find((h) => h.textContent.trim().length > 0);
    const badgeText = badgeEl ? badgeEl.textContent.trim() : "";
    const heading = element.querySelector(":scope h1, :scope h2");
    const cells = [];
    const imageCell = [];
    if (bgImg) {
      imageCell.push(document2.createComment(" field:image "));
      const picture = bgImg.closest("picture");
      imageCell.push((picture || bgImg).cloneNode(true));
    }
    cells.push([imageCell]);
    const contentCell = [];
    if (heading) {
      contentCell.push(document2.createComment(" field:text "));
      contentCell.push(heading.cloneNode(true));
    }
    if (badgeText) {
      contentCell.push(document2.createComment(" field:badge "));
      contentCell.push(document2.createTextNode(badgeText));
    }
    cells.push([contentCell]);
    if (!bgImg && !heading && !badgeText) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-skyline", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse2(element, { document: document2 }) {
    const slides = Array.from(element.querySelectorAll(":scope > .swiper-slide, .swiper-slide"));
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("h3 a[href], a[href]");
      const date = slide.querySelector("p");
      if (!link && !date) return;
      const cardCell = [document2.createComment(" field:text ")];
      if (link) {
        const heading = document2.createElement("h3");
        heading.appendChild(link.cloneNode(true));
        cardCell.push(heading);
      }
      if (date && date.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        cardCell.push(p);
      }
      cells.push([cardCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse3(element, { document: document2 }) {
    const tiles = Array.from(
      element.querySelectorAll(":scope > a[href], a.group[href]")
    );
    const cells = [];
    tiles.forEach((tile) => {
      const href = tile.getAttribute("href");
      const img = tile.querySelector("picture > img, img");
      const labelEl = tile.querySelector("h3");
      const label = labelEl ? labelEl.textContent.trim() : "";
      if (!href && !img && !label) return;
      const imageCell = [];
      if (img) {
        imageCell.push(document2.createComment(" field:image "));
        const picture = img.closest("picture");
        imageCell.push((picture || img).cloneNode(true));
      }
      const textCell = [document2.createComment(" field:text ")];
      if (href) {
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = label || href;
        textCell.push(a);
      } else if (label) {
        textCell.push(document2.createTextNode(label));
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-links.js
  function parse4(element, { document: document2 }) {
    const links = Array.from(element.querySelectorAll(":scope > a[href], a[href]"));
    const cells = [];
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const label = link.textContent.trim();
      if (!href && !label) return;
      const textCell = [document2.createComment(" field:text ")];
      const a = document2.createElement("a");
      if (href) a.setAttribute("href", href);
      a.textContent = label || href || "";
      textCell.push(a);
      cells.push([textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/moc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const hero = element.querySelector("#high-impact-hero");
      const newsList = element.querySelector(".swiper-wrapper");
      if (hero && newsList && hero.contains(newsList)) {
        hero.after(newsList);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header / nav + everything inside it (search buttons, language switcher,
        // date/time strip, logo). Migrated separately — cleaned.html L7.
        "header",
        // Footer (social links, copyright). Migrated separately — cleaned.html L585.
        "footer",
        // Decorative fixed full-page background image — cleaned.html L4.
        'img[alt="background image"]',
        // Decorative header background image (sits above <header>) — cleaned.html L6.
        'img[alt="header-bg"]',
        // Floating chatbot launcher (the fixed "اسألني" element) — cleaned.html L607.
        ".fixed.bottom-6.right-6",
        // Toast top container (empty runtime shell) — cleaned.html L620.
        ".fixed.top-4",
        // Toast notification list (empty runtime shell) — cleaned.html L623.
        "ol.fixed",
        // Next.js route announcer (a11y runtime element) — cleaned.html L626.
        "next-route-announcer",
        // Decorative background <video> duplicates (mobile + desktop) and their
        // <source> children, between hero/news and e-services — cleaned.html L492/L497.
        "video",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/moc-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-moc-kuwait-arabic-homepage.js
  var parsers = {
    "hero-skyline": parse,
    "cards-news": parse2,
    "cards-service": parse3,
    "cards-links": parse4
  };
  var PAGE_TEMPLATE = {
    name: "MOC Kuwait Arabic Homepage",
    description: "RTL (dir=rtl, lang=ar) Ministry of Communications Kuwait Arabic homepage. Main content: a full-bleed skyline hero with an overlaid '\u0627\u0644\u0623\u062E\u0628\u0627\u0631' news label card, a ~40-item news list, a 4-tile e-services grid (\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629), and a 6-button important-links row (\u0627\u0644\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u0645\u0647\u0645\u0629). Header/nav and footer are migrated separately.",
    urls: ["https://moc.gov.kw/ar"],
    blocks: [
      {
        name: "hero-skyline",
        instances: ["#high-impact-hero"]
      },
      {
        name: "cards-news",
        instances: [".swiper-wrapper"]
      },
      {
        name: "cards-service",
        instances: [".grid.grid-cols-2"]
      },
      {
        name: "cards-links",
        instances: [".flex.flex-row.items-center.justify-center.gap-4.container"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero \u2014 Kuwait skyline with News label card",
        selector: "#high-impact-hero",
        style: null,
        blocks: ["hero-skyline"],
        defaultContent: []
      },
      {
        id: "section-news",
        name: "News list (\u0627\u0644\u0623\u062E\u0628\u0627\u0631)",
        selector: ".swiper-wrapper",
        style: null,
        blocks: ["cards-news"],
        defaultContent: []
      },
      {
        id: "section-eservices",
        name: "E-Services grid (\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629)",
        selector: ".grid.grid-cols-2",
        style: null,
        blocks: ["cards-service"],
        defaultContent: ["h2:has(> span)"]
      },
      {
        id: "section-important-links",
        name: "Important links (\u0627\u0644\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u0645\u0647\u0645\u0629)",
        selector: ".flex.flex-row.items-center.justify-center.gap-4.container",
        style: null,
        blocks: ["cards-links"],
        defaultContent: ["h2:has(> span)"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_moc_kuwait_arabic_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_moc_kuwait_arabic_homepage_exports);
})();
