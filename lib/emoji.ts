import { OwOlist } from './emoji-data';

export { OwOlist };

const emojiMap = new Map(OwOlist.map((o) => [o.title, o.url]));

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
  return escaped.replace(/\[([一-龥]+)\]/g, (whole, name: string) => {
    const url = emojiMap.get(name);
    return url
      ? `<img src="/img/emot/image/${url}" alt="${name}" class="inline-block h-5 w-5 align-text-bottom" />`
      : whole;
  });
}
