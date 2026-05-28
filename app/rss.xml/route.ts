import { getArticles } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Escape XML special chars (CDATA is used below, but title/category may still contain "]]>").
function safe(s: string): string {
  return (s ?? '').replace(/]]>/g, ']]&gt;');
}

export async function GET() {
  const site = 'https://mangoya.cn';
  const { items } = await getArticles({ pageSize: 20 });
  const lastBuild = items[0]?.createDate
    ? new Date(items[0].createDate).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Aimee's Blog</title>
  <link>${site}</link>
  <description>个人博客 3.0 — 记录前端、全栈、AI 工具与折腾</description>
  <language>zh-CN</language>
  <lastBuildDate>${lastBuild}</lastBuildDate>
  <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (a) => `  <item>
    <title><![CDATA[${safe(a.title)}]]></title>
    <link>${site}/article/${a.id}</link>
    <guid isPermaLink="true">${site}/article/${a.id}</guid>
    <pubDate>${new Date(a.createDate).toUTCString()}</pubDate>
    <description><![CDATA[${safe(a.summary)}]]></description>${
      a.categoryName ? `\n    <category><![CDATA[${safe(a.categoryName)}]]></category>` : ''
    }
  </item>`,
  )
  .join('\n')}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
