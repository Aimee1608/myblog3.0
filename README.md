# myblog3.0

个人博客 3.0 — 基于 **Next.js 15 + TypeScript + Tailwind CSS** 全栈重构，复刻 2.0 时代的 Butterfly 风格 UI。

🔗 线上：<https://mangoya.cn>

## 特性

- **前台**：banner 大图 + 打字机、圆形日期卡片、左突出分类标签、Markdown 文章渲染、归档/分类/标签/友链/关于/留言板
- **侧栏**：博主信息卡、Do you like me 心形点赞（28 帧雪碧图）、最新评论、热门浏览
- **互动**：GitHub OAuth 登录、发评论、点赞、OwO 表情、滚动到顶部小猫
- **后台**：`/admin` 文章 CRUD、评论管理、分类/标签管理，仅管理员可见可进
- **效果**：evanyou 渐变波浪背景

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 15 (App Router) + React 19 + TypeScript |
| 样式 | Tailwind CSS + `@tailwindcss/typography` |
| 数据 | MongoDB 4.4 + Mongoose 8 |
| 鉴权 | Auth.js v5（GitHub OAuth） |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 部署 | Docker + 宝塔 nginx 反代 |

## 本地开发

```bash
# 1. 装依赖
npm install

# 2. 本地起 MongoDB 并导入备份
docker run -d --name myblog-mongo -p 27017:27017 mongo:4.4
# 把备份的 aimeeblog 数据 mongorestore 进容器

# 3. 配置环境变量
cp .env.example .env.local
# 填入 MONGODB_URI / AUTH_SECRET / AUTH_GITHUB_ID/SECRET / ADMIN_USER_IDS

# 4. 启动
npm run dev      # http://localhost:3000
```

## 项目结构

```
app/
├── (public)/      # 前台博客（首页/文章/归档/分类/标签/关于/友链/留言）
├── admin/         # 后台管理（middleware 仅 admin 可入）
└── api/auth/      # OAuth 回调
components/        # UI 组件（site / article / admin / effects）
lib/
├── db/            # Mongoose 模型与连接（对齐旧 aimeeblog 集合）
├── queries.ts     # 数据查询（文章列表/侧栏/评论/管理）
└── emoji.ts       # OwO 表情渲染
auth.ts / auth.config.ts   # Auth.js 配置（edge/node 拆分）
middleware.ts     # /admin 保护
instrumentation.ts  # undici 全局重试（缓解国内访问 GitHub 偶发 reset）
```

## 部署

本机构建镜像 → `docker save | gzip` → scp 到 ECS → `docker load` → 起容器（host 网络、监听 `127.0.0.1:3000`），宝塔 nginx 反代 `mangoya.cn` → 容器。

```bash
./deploy.sh   # 一条命令完成构建/上传/启动
```

详细方案与改造决策见 [PLAN.md](./PLAN.md)。

## License

个人项目，未授权。
