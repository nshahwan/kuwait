# MOC Kuwait — Arabic Homepage Migration Plan

Migrate the Kuwait Ministry of Communications Arabic homepage (`https://moc.gov.kw/ar`) into this AEM Edge Delivery Services project. This is a **right-to-left (RTL) Arabic** government page, which is the key design constraint driving the whole migration.

## Page Overview (from live inspection)

- **Language / direction:** Arabic, RTL. The whole layout, nav, and blocks must mirror correctly.
- **Header / Nav:** Date/time strip, language switcher (العربية / Kuwait flag), search button, App logo linking to `/ar`, and a two-row main nav: `الصفحة الرئيسية` (Home), `الأخبار` (News), `اتصل بنا` (Contact), `نبذة عن الوزارة` (About), plus `قوانين وتشريعات`, `ممارسات ومناقصات ومزايدات`, `قطاعات الوزارة`, `مراكز الوزارة`.
- **Main content sections:**
  1. **News list (`الأخبار`)** — long scrollable list of ~40 news items, each a headline link + date. Candidate for a **cards** / editorial-index style block.
  2. **E-Services grid (`الخدمات الإلكترونية`)** — 4 icon+label link tiles (e-payment, shipment tracking, e-portal, employee services). Candidate for a **cards** grid.
  3. **Important Links (`الروابط المهمة`)** — tabbed/carousel list of link items (postal codes, office numbers, citizen service, Meta platform).
- **Footer:** Privacy policy link, Instagram + Twitter/X social icons, copyright line (© 2026).
- **Floating element:** Chatbot launcher (`اسألني`) — likely out of scope / handled as a link or omitted.

## Open Questions / Assumptions

- **Assumption:** Migrating only the single page `/ar` (the homepage) for now, not the whole site. If you want the full site cataloged and migrated, say so and I'll expand this into a multi-page site-migration plan.
- **Assumption:** RTL support must be added to the project (this project's existing WKND content is LTR). This is the biggest new piece of work — see step below.
- **TLS note:** Direct fetch of the source failed certificate verification; scraping will run through the browser-based scrape tooling instead, which already worked for inspection.

## Approach

Use the standard EDS migration pipeline: analyze the page → map content to blocks → build import infrastructure (parsers/transformers) → run the import to generate content HTML → style blocks (with RTL) → verify in preview against the original.

## Checklist

- [ ] **Scrape & analyze** the source page (`/ar`) — capture cleaned HTML, screenshots, metadata, and image assets.
- [ ] **Identify page structure** — confirm section boundaries: news list, e-services grid, important links, and footer/nav.
- [ ] **Survey the block palette** — check existing project blocks (cards, editorial-index, columns, etc.) for reuse vs. new variants needed.
- [ ] **Content modeling / authoring analysis** — decide default-content vs. block for each sequence; pick block variants for news list, e-services grid, and important-links.
- [ ] **Add RTL support** — set `dir="rtl"` / `lang="ar"` handling, Arabic web font, and RTL-aware CSS in `styles.css` (logical properties: `margin-inline`, `padding-inline`, etc.).
- [ ] **Build import infrastructure** — block parsers + section/cleanup transformers driven by DOM selectors (content-driven, no URL/positional assumptions).
- [ ] **Bundle & run the importer** to generate the content `.plain.html` (never hand-write content files).
- [ ] **Migrate header/nav** — RTL two-row nav, logo, language switcher, search affordance.
- [ ] **Migrate footer** — social icons, copyright, privacy link.
- [ ] **Style the blocks** — match the original visual design (colors, fonts, spacing) using existing CSS custom properties where possible; verify RTL alignment.
- [ ] **Preview & verify** — render locally, snapshot/evaluate the DOM and computed styles, compare against the original for content completeness and layout.
- [ ] **Lint** — run `npm run lint` and fix any issues (remember: unquoted font-family names).
- [ ] **Final visual critique** — side-by-side comparison with the source; iterate on any gaps.

## Notes

- Content HTML will be generated only via the bundled import script + bulk importer — no direct editing/creation of files in the content directory.
- Git operations are out of scope entirely — those are managed through the Console UI.

**Execution requires Execute mode** — approve this plan (or tell me what to change) and I'll switch out of plan mode to carry it out. If you actually want the *entire* site rather than just this one page, let me know and I'll widen the plan first.
