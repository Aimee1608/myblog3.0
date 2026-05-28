import type { MetadataRoute } from 'next';
import { getArticles, getAllCategories, getAllTags } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const SITE = 'https://mangoya.cn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE}/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/message`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE}/links`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const [{ items: articles }, cats, tags] = await Promise.all([
    getArticles({ pageSize: 1000 }),
    getAllCategories(),
    getAllTags(),
  ]);

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/article/${a.id}`,
    lastModified: new Date(a.createDate),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const catPages: MetadataRoute.Sitemap = cats.map((c) => ({
    url: `${SITE}/category/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${SITE}/tag/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [...staticPages, ...articlePages, ...catPages, ...tagPages];
}
