import { OwOlist } from './emoji-data';
import { LegacyOwOlist } from './emoji-data-legacy';

export { OwOlist };

const emojiMap = new Map(OwOlist.map((o) => [o.title, o.url]));
// Fallback for emoji codes used in old comments (low-res Sina gifs).
const legacyMap = new Map(LegacyOwOlist.map((o) => [o.title, o.url]));

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Escape user content (XSS-safe), then turn [name] tokens into emoji <img>.
export function renderComment(content: string): string {
  const escaped = escapeHtml(content);
  return escaped.replace(/\[([^\[\]\n]+)\]/g, (whole, name: string) => {
    const url = emojiMap.get(name);
    if (url) {
      return `<img src="/img/emot/fluent3d/${url}" alt="${name}" class="inline-block h-6 w-6 align-text-bottom" />`;
    }
    const legacy = legacyMap.get(name);
    if (legacy) {
      return `<img src="/img/emot/image/${legacy}" alt="${name}" class="inline-block h-5 w-5 align-text-bottom" />`;
    }
    return whole;
  });
}
