import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Map source (moc.gov.kw) e-service tile images to their local copies so they
 * render in preview. The source serves them through a Next.js image proxy
 * (`/_next/image?url=...`) that is not reachable from the migrated site.
 */
const LOCAL_IMAGE_MAP = [
  { match: 'pexels-pixabay-50987', local: '/content/moc-service-payment.png' },
  { match: 'file%2Fimage.png', local: '/content/moc-service-tracking.png' },
  { match: 'image%2520123', local: '/content/moc-service-portal.png' },
  { match: 'service-4', local: '/content/moc-service-employees.png' },
];

function resolveLocalSrc(src) {
  const entry = LOCAL_IMAGE_MAP.find((m) => src.includes(m.match));
  return entry ? entry.local : src;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-service-card-image';
      else div.className = 'cards-service-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const resolved = resolveLocalSrc(img.getAttribute('src') || img.src);
    let isAbsolute = false;
    try {
      isAbsolute = new URL(resolved, window.location.origin).origin !== window.location.origin;
    } catch (_) {
      isAbsolute = false;
    }
    // createOptimizedPicture only works for same-origin EDS media; for absolute
    // external URLs keep a plain <img> with the resolved (local) source.
    if (isAbsolute) {
      img.src = resolved;
    } else {
      const optimizedPic = createOptimizedPicture(resolved, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.textContent = '';
  block.append(ul);
}
