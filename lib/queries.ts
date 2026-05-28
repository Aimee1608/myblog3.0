import { isValidObjectId } from 'mongoose';
import { dbConnect } from './db/connect';
import {
  ArticleModel,
  ArticleCateModel,
  TagModel,
  CommentModel,
  UserModel,
  LikeModel,
  CollectModel,
  BrowseModel,
  LoveModel,
} from './db/models';

export interface ArticleListItem {
  id: string;
  title: string;
  summary: string;
  classId?: string;
  categoryName: string;
  tagNames: string[];
  isHot: number;
  isRecommend: number;
  createDate: string;
  browseCount: number;
  commentCount: number;
  likeCount: number;
  collectCount: number;
}

export interface ArticleDetail extends ArticleListItem {
  content: string;
  lastModifiedDate: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface FriendLink {
  name: string;
  url: string;
  icon?: string;
  desc?: string;
}

// Build a short plain-text summary from markdown content.
function summarize(content?: string, n = 120): string {
  if (!content) return '';
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, n);
}

async function categoryTagMaps() {
  const [cates, tags] = await Promise.all([
    ArticleCateModel.find().lean(),
    TagModel.find().lean(),
  ]);
  const cateMap = new Map(cates.map((c) => [String(c._id), c.name]));
  const tagMap = new Map(tags.map((t) => [String(t._id), t.name]));
  return { cateMap, tagMap };
}

export interface GetArticlesParams {
  page?: number;
  pageSize?: number;
  classId?: string;
  tag?: string;
  q?: string;
}

export async function getArticles(params: GetArticlesParams = {}) {
  const { page = 1, pageSize = 10, classId, tag, q } = params;
  await dbConnect();

  const filter: Record<string, unknown> = { state: 1 };
  if (classId) filter.classId = classId;
  if (tag) filter.tags = tag;
  if (q) filter.title = { $regex: q, $options: 'i' };

  const { cateMap, tagMap } = await categoryTagMaps();
  const [docs, total] = await Promise.all([
    ArticleModel.find(filter)
      .sort({ createDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    ArticleModel.countDocuments(filter),
  ]);

  const ids = docs.map((d) => String(d._id));
  const aggCount = (match: Record<string, unknown>) => [
    { $match: { articleId: { $in: ids }, ...match } },
    { $group: { _id: '$articleId', n: { $sum: 1 } } },
  ];
  const [bAgg, cAgg, lAgg, coAgg] = await Promise.all([
    BrowseModel.aggregate(aggCount({})),
    CommentModel.aggregate(aggCount({ state: 1 })),
    LikeModel.aggregate(aggCount({})),
    CollectModel.aggregate(aggCount({})),
  ]);
  const toMap = (agg: Array<{ _id: string; n: number }>) =>
    new Map(agg.map((a) => [String(a._id), a.n]));
  const bMap = toMap(bAgg);
  const cMap = toMap(cAgg);
  const lMap = toMap(lAgg);
  const coMap = toMap(coAgg);

  const items: ArticleListItem[] = docs.map((d) => {
    const id = String(d._id);
    return {
      id,
      title: d.title,
      summary: summarize(d.content),
      classId: d.classId,
      categoryName: d.classId ? cateMap.get(d.classId) ?? '' : '',
      tagNames: (d.tags ?? [])
        .map((t) => tagMap.get(t))
        .filter((x): x is string => Boolean(x)),
      isHot: d.isHot,
      isRecommend: d.isRecommend,
      createDate:
        d.createDate instanceof Date ? d.createDate.toISOString() : String(d.createDate),
      browseCount: bMap.get(id) ?? 0,
      commentCount: cMap.get(id) ?? 0,
      likeCount: lMap.get(id) ?? 0,
      collectCount: coMap.get(id) ?? 0,
    };
  });

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getArticleById(id: string): Promise<ArticleDetail | null> {
  if (!isValidObjectId(id)) return null;
  await dbConnect();
  const d = await ArticleModel.findOne({ _id: id, state: 1 }).lean();
  if (!d) return null;
  const { cateMap, tagMap } = await categoryTagMaps();
  const [browseCount, commentCount, likeCount, collectCount] = await Promise.all([
    BrowseModel.countDocuments({ articleId: id }),
    CommentModel.countDocuments({ articleId: id, state: 1 }),
    LikeModel.countDocuments({ articleId: id }),
    CollectModel.countDocuments({ articleId: id }),
  ]);
  return {
    id: String(d._id),
    title: d.title,
    content: d.content ?? '',
    summary: summarize(d.content),
    classId: d.classId,
    categoryName: d.classId ? cateMap.get(d.classId) ?? '' : '',
    tagNames: (d.tags ?? [])
      .map((t) => tagMap.get(t))
      .filter((x): x is string => Boolean(x)),
    isHot: d.isHot,
    isRecommend: d.isRecommend,
    createDate:
      d.createDate instanceof Date ? d.createDate.toISOString() : String(d.createDate),
    lastModifiedDate:
      d.lastModifiedDate instanceof Date
        ? d.lastModifiedDate.toISOString()
        : String(d.lastModifiedDate),
    browseCount,
    commentCount,
    likeCount,
    collectCount,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  await dbConnect();
  const cates = await ArticleCateModel.find({ state: 1 }).sort({ createDate: 1 }).lean();
  return cates.map((c) => ({ id: String(c._id), name: c.name }));
}

export async function getAllTags(): Promise<Tag[]> {
  await dbConnect();
  const tags = await TagModel.find({ state: 1 }).sort({ createDate: 1 }).lean();
  return tags.map((t) => ({ id: String(t._id), name: t.name }));
}

export interface ArchiveGroup {
  ym: string; // e.g. "2024-04"
  items: { id: string; title: string; createDate: string }[];
}

export async function getArchives(): Promise<ArchiveGroup[]> {
  await dbConnect();
  const docs = await ArticleModel.find({ state: 1 })
    .sort({ createDate: -1 })
    .select('title createDate')
    .lean();
  const groups = new Map<string, ArchiveGroup>();
  for (const d of docs) {
    const date = d.createDate instanceof Date ? d.createDate : new Date(d.createDate);
    const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups.has(ym)) groups.set(ym, { ym, items: [] });
    groups.get(ym)!.items.push({
      id: String(d._id),
      title: d.title,
      createDate: date.toISOString(),
    });
  }
  return [...groups.values()];
}

export async function getSiteStats() {
  await dbConnect();
  const [articles, comments] = await Promise.all([
    ArticleModel.countDocuments({ state: 1 }),
    CommentModel.countDocuments({ state: 1 }),
  ]);
  return { articles, comments };
}

// Friend links live in the user collection (webBlogState=1).
export async function getFriendLinks(): Promise<FriendLink[]> {
  await dbConnect();
  const users = await UserModel.find({ webBlogState: 1, webBlog: { $ne: null } })
    .select('webBlogName webBlog webBlogIcon webBlogDesc')
    .lean();
  return users
    .filter((u) => u.webBlog)
    .map((u) => ({
      name: u.webBlogName ?? u.webBlog ?? '',
      url: u.webBlog ?? '',
      icon: u.webBlogIcon ?? undefined,
      desc: u.webBlogDesc ?? undefined,
    }));
}

export interface CommentItem {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  parentId?: string;
  createDate: string;
}

// ---- Admin queries (include hidden articles, all states) ----

export interface AdminArticleRow {
  id: string;
  title: string;
  categoryName: string;
  state: number;
  isHot: number;
  isRecommend: number;
  createDate: string;
}

export async function getAdminArticles(): Promise<AdminArticleRow[]> {
  await dbConnect();
  const { cateMap } = await categoryTagMaps();
  const docs = await ArticleModel.find()
    .sort({ createDate: -1 })
    .select('title classId state isHot isRecommend createDate')
    .lean();
  return docs.map((d) => ({
    id: String(d._id),
    title: d.title,
    categoryName: d.classId ? cateMap.get(d.classId) ?? '' : '',
    state: d.state,
    isHot: d.isHot,
    isRecommend: d.isRecommend,
    createDate:
      d.createDate instanceof Date ? d.createDate.toISOString() : String(d.createDate),
  }));
}

export interface ArticleEditData {
  id: string;
  title: string;
  content: string;
  classId: string;
  tags: string[];
  state: number;
  isHot: number;
  isRecommend: number;
}

export async function getArticleForEdit(id: string): Promise<ArticleEditData | null> {
  if (!isValidObjectId(id)) return null;
  await dbConnect();
  const d = await ArticleModel.findById(id).lean();
  if (!d) return null;
  return {
    id: String(d._id),
    title: d.title,
    content: d.content ?? '',
    classId: d.classId ?? '',
    tags: d.tags ?? [],
    state: d.state,
    isHot: d.isHot,
    isRecommend: d.isRecommend,
  };
}

// Comments reference users by user.userId (third-party id), not _id.
export async function getComments(articleId: string): Promise<CommentItem[]> {
  await dbConnect();
  const comments = await CommentModel.find({ articleId, state: 1 })
    .sort({ createDate: 1 })
    .lean();
  const userIds = [...new Set(comments.map((c) => c.userId))];
  const users = await UserModel.find({ userId: { $in: userIds } })
    .select('userId username avatar')
    .lean();
  const umap = new Map(users.map((u) => [u.userId, u]));
  return comments.map((c) => ({
    id: String(c._id),
    userId: c.userId,
    username: umap.get(c.userId)?.username ?? '匿名用户',
    avatar: umap.get(c.userId)?.avatar ?? undefined,
    content: c.content ?? '',
    parentId: c.parentId,
    createDate:
      c.createDate instanceof Date ? c.createDate.toISOString() : String(c.createDate),
  }));
}

export async function getLikeInfo(
  articleId: string,
  userId?: string,
): Promise<{ count: number; liked: boolean }> {
  await dbConnect();
  const [count, mine] = await Promise.all([
    LikeModel.countDocuments({ articleId }),
    userId ? LikeModel.countDocuments({ articleId, userId }) : Promise.resolve(0),
  ]);
  return { count, liked: mine > 0 };
}

export interface AdminCommentRow {
  id: string;
  content: string;
  username: string;
  articleId: string;
  state: number;
  createDate: string;
}

export async function getAdminComments(limit = 100): Promise<AdminCommentRow[]> {
  await dbConnect();
  const comments = await CommentModel.find().sort({ createDate: -1 }).limit(limit).lean();
  const userIds = [...new Set(comments.map((c) => c.userId))];
  const users = await UserModel.find({ userId: { $in: userIds } })
    .select('userId username')
    .lean();
  const umap = new Map(users.map((u) => [u.userId, u.username]));
  return comments.map((c) => ({
    id: String(c._id),
    content: c.content ?? '',
    username: umap.get(c.userId) ?? c.userId,
    articleId: c.articleId ?? '',
    state: c.state,
    createDate:
      c.createDate instanceof Date ? c.createDate.toISOString() : String(c.createDate),
  }));
}

// ---- Sidebar data (likes total / recent comments / hot articles) ----

export interface SidebarComment {
  username: string;
  avatar?: string;
  content: string;
  title: string;
  articleId: string;
  isArticle: boolean;
}

export interface HotArticle {
  id: string;
  title: string;
  count: number;
}

const SPECIAL_PAGE_NAMES: Record<string, string> = {
  message: '留言板',
  aboutme: '关于',
  friendslink: '友链',
  friendlink: '友链',
  reward: '赞赏',
};

export async function getSidebarData(): Promise<{
  loveCount: number;
  recentComments: SidebarComment[];
  hotArticles: HotArticle[];
}> {
  await dbConnect();
  const [loveCount, recentRaw, hotAgg] = await Promise.all([
    LoveModel.countDocuments(),
    CommentModel.find({ state: 1 }).sort({ createDate: -1 }).limit(8).lean(),
    BrowseModel.aggregate([
      { $match: { articleId: { $regex: /^[0-9a-f]{24}$/ } } },
      { $group: { _id: '$articleId', n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const userIds = [...new Set(recentRaw.map((c) => c.userId))];
  const users = await UserModel.find({ userId: { $in: userIds } })
    .select('userId username avatar')
    .lean();
  const umap = new Map(users.map((u) => [u.userId, u]));

  const articleIds = [
    ...new Set([
      ...recentRaw
        .map((c) => c.articleId)
        .filter((a): a is string => !!a && isValidObjectId(a)),
      ...hotAgg.map((h: { _id: string }) => String(h._id)),
    ]),
  ];
  const arts = await ArticleModel.find({ _id: { $in: articleIds } })
    .select('title')
    .lean();
  const amap = new Map(arts.map((a) => [String(a._id), a.title]));

  const recentComments: SidebarComment[] = recentRaw.map((c) => {
    const isArticle = !!c.articleId && isValidObjectId(c.articleId);
    return {
      username: umap.get(c.userId)?.username ?? '匿名',
      avatar: umap.get(c.userId)?.avatar ?? undefined,
      content: c.content ?? '',
      title: isArticle
        ? amap.get(c.articleId as string) ?? '文章'
        : SPECIAL_PAGE_NAMES[c.articleId ?? ''] ?? (c.articleId ?? ''),
      articleId: c.articleId ?? '',
      isArticle,
    };
  });

  const hotArticles: HotArticle[] = hotAgg.map((h: { _id: string; n: number }) => ({
    id: String(h._id),
    title: amap.get(String(h._id)) ?? '文章',
    count: h.n,
  }));

  return { loveCount, recentComments, hotArticles };
}
