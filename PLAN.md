# 个人博客 3.0 技术改造方案

> 状态：方案待确认 → 确认后进入开发
> 目标产物：一个可上传 GitHub 的 Next.js 单仓项目，平滑替换现有 `mangoya.cn` 博客

---

## 1. 背景与现状

### 1.1 旧版（myblog2.0 系列，三个独立仓库）

| 项目 | 角色 | 技术栈 | 问题 |
|---|---|---|---|
| myblog2.0 | 前台 | Vue 2.6 + vue-cli + Element UI + axios 0.19 | Vue2 已 EOL、纯 CSR 无 SEO、依赖有 CVE |
| myblog2.0-admin | 后台 | Vue 3 + Vite + Element Plus 1.0-beta | 与前台栈割裂、锁死远古 beta 版 |
| myblog2.0-server | 服务端 | Koa 2 + TS + Mongoose 5 + JWT + PM2 | Mongoose 5 在新 Node 跑不起来、tslint 废弃 |

### 1.2 部署环境（阿里云 ECS，已实地体检）

- **规格**：2 vCPU / 2 GiB（ecs.c1m1.large），系统盘 40G（已用 22G，余 17G），3 Mbps 带宽
- **系统**：CentOS 7.9（已 EOL，glibc 2.17 过老，宿主机装不了新版 Node）
- **关键约束**：内存仅剩 **~357MB available**，是整个改造的头号瓶颈
- **这是一台宝塔(BT-Panel)管理的生产多站点服务器**，与博客无关、**绝不能碰**的服务见 §13
- **已装 Docker 26.1.4**（ECS 端可直接 load+run，无需安装）
- **MongoDB 4.4.6**：库 `aimeeblog` 存博客数据，基本博客专用，监听 127.0.0.1:27017

### 1.3 现有博客数据（aimeeblog，必须完整保留）

| 集合 | 数量 | 集合 | 数量 |
|---|---|---|---|
| article 文章 | 52 | comment 评论 | 880 |
| articleCate 分类 | 5 | user 用户 | 64 |
| tags 标签 | 7 | love / like | 5857 / 11 |
| resource 资源 | 52 | browse 浏览 | 3577 |
| collect 收藏 | 5 | chat | 1 |

`article` 字段：`title / content(markdown) / tags[](→tags) / classId(→articleCate) / isHot / isRecommend / state / createDate / lastModifiedDate`。

---

## 2. 改造目标

1. 前端换 **React** 技术栈，现代化、可长期维护。
2. **单仓**（所有代码一处），后续上传 GitHub。
3. **BFF 形态**，部署简单。
4. 拿到 **SSR/SSG + SEO**（旧版纯 CSR 的最大短板）。
5. 与 ECS 现有多站点服务**和平共存**，**不额外花钱**（不买云数据库、不买 ACR）。
6. **复用现有数据**，平滑替换 `mangoya.cn`，老服务验证后再下线。

---

## 3. 技术选型

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | **Next.js 15（App Router）** | React + SSR/SSG + 内置 BFF(Route Handlers / Server Components) |
| 语言 | **TypeScript** | 全栈类型 |
| 样式 | **Tailwind CSS + shadcn/ui** | React 生态事实标准 |
| 数据 | **MongoDB 4.4.6 + Mongoose 8** | 复用现有库；Mongoose 8 兼容 MongoDB 4.2+，不升级 mongo、不新建容器 |
| 鉴权 | **Auth.js (NextAuth v5)** 或自管 JWT | 区分 admin/普通用户，保护 /admin；兼容旧 md5 密码（见 §7） |
| Markdown | **react-markdown + rehype-highlight**（或 next-mdx-remote） | 渲染文章正文 + 代码高亮 |
| 客户端态 | RSC 为主 + **TanStack Query**（少量交互） | 评论/点赞等 |
| 测试 | **Vitest + Testing Library + Playwright** | 见 §10 |
| 构建/部署 | 本机 docker build → save → scp → ECS load | 见 §11 |

> **为什么不上 Turborepo/pnpm-workspace 重型 Monorepo**：admin 并入前端、BFF 用 Next 内置后，三项目收敛成「一个 Next 应用」，多包 monorepo 属过度设计。单仓 + 目录分层即可满足「代码都在一处」。

---

## 4. 系统架构

### 4.1 应用形态（单 Next 应用）

```
浏览器 ──► 宝塔 Nginx (80/443, mangoya.cn, 复用现有 Let's Encrypt 证书)
              │  反向代理
              ▼
      Next.js 容器 (127.0.0.1:3000, docker)
        ├── app/(public)/*   前台博客（SSR/SSG）
        ├── app/admin/*      后台管理（middleware 角色鉴权）
        └── app/api/*        BFF：评论/点赞/登录等交互
              │  Mongoose 8
              ▼
      MongoDB 4.4.6 (127.0.0.1:27017, 复用 aimeeblog)
```

- 前台读列表/详情：Server Component 直接查 DB（SSR + 缓存）→ SEO 友好
- 写操作（评论/点赞/登录/后台 CRUD）：走 `app/api/*` Route Handler
- `lib/db` 是唯一访问数据库的层，前后台共用，类型打通

### 4.2 目录结构

```
myblog3.0/
├── PLAN.md                  # 本方案
├── README.md                # 上传 GitHub 用
├── app/
│   ├── (public)/            # 前台：首页/文章/归档/分类/标签/关于/留言
│   ├── admin/               # 后台：文章CRUD/分类/标签/评论/资源
│   ├── api/                 # BFF route handlers
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── db/                  # mongoose 连接 + models（对齐 aimeeblog）
│   ├── auth/                # 鉴权与会话
│   └── utils/
├── components/
│   └── ui/                  # shadcn 组件
├── middleware.ts            # /admin 角色保护
├── __tests__/ & e2e/        # 测试
├── Dockerfile
├── deploy.sh                # 本机 build→save→scp→ECS load→run
├── .env.example
└── docker-compose.ecs.yml   # ECS 端仅运行用（不抢 80/443）
```

---

## 5. 数据方案（复用，零转换）

### 5.1 Model 映射（Mongoose 8，字段对齐现有集合）

| Mongoose Model | 集合 | 关键字段 |
|---|---|---|
| Article | article | title, content(md), tags[], classId, isHot, isRecommend, state, createDate, lastModifiedDate |
| ArticleCate | articleCate | name … |
| Tag | tags | name … |
| Comment | comment | （关联 article / user） |
| User | user | 含旧密码 hash（md5，见 §7） |
| Resource | resource | |
| Like / Collect / Love / Browse | 同名 | 互动与统计 |

> 保留 `__v`、`_id(ObjectId)`、日期字段语义，确保旧数据直接可读。

### 5.2 备份（动数据前必做）

```bash
# 在 ECS 上
mongodump --db aimeeblog --out /root/backup/aimeeblog_$(date +%F)
# 下载到本地兜底
scp -r myblog:/root/backup/aimeeblog_xxxx ./backup/
```

### 5.3 已知数据隐患（后续任务，不阻塞）

文章正文图片为简书图床外链（`upload-images.jianshu.io`），有防盗链，新站可能 403。主体跑通后批量转存到服务器/OSS 并替换链接。

---

## 6. 鉴权方案（依据实际数据修正）

> **已核实** `aimeeblog.user`：旧站**无密码字段**，登录全靠第三方 OAuth；64 个用户 `status` 全为 3，**未用 status 区分管理员**。origin 分布：github 27 / weibo 23 / null 14。博主账号：`userId=Aimee1608`（GitHub login），`username=Aimee`。

- **登录**：Auth.js (NextAuth v5) + **GitHub OAuth Provider**（主）；微博 OAuth 已老旧，按需再补。登录成功后 upsert 到 `user` 表（origin/userId/username/avatar/email），结构与旧数据一致。
- **管理员认定**：用环境变量 `ADMIN_USER_IDS=Aimee1608`（GitHub login 列表）判定；命中即管理员，并把该用户 `status` 持久化为 1。`middleware.ts` 拦截 `/admin/*`，非管理员重定向首页。
- **会话**：Auth.js JWT session（httpOnly cookie），session 内含 `userId` 与 `isAdmin`。
- 评论 / 点赞 / 收藏需登录（任意 OAuth 用户）；`/admin` 仅管理员。

---

## 7. 开发计划（里程碑，对应任务清单）

1. ✅ 本机安装 Docker（已完成）
2. 备份 aimeeblog 数据库
3. 初始化 Next.js 单仓脚手架
4. 数据层 Mongoose models
5. 前台博客页面（首页/详情/归档/分类/标签/关于/留言 + 评论/点赞/收藏）
6. 后台 /admin + 登录鉴权
7. Dockerfile + deploy.sh
8. 部署 ECS + 宝塔 nginx 反代 mangoya.cn
9. 验证后下线老服务
10. 迁移简书外链图片（后续）

---

## 8. 本地开发与验证

**数据库连法（推荐方案 A，安全不污染线上）：**

- **A. 本地起 MongoDB + 导入备份数据**开发：用 §5.2 的 dump 在本地 `docker run mongo:4.4` 导入，开发期与线上隔离，随便造数据。✅ 推荐
- B. SSH 隧道连线上 mongo：`ssh -L 27017:127.0.0.1:27017 myblog`，直连真实库（只读验证用，写操作慎用）。

**环境变量**（`.env.local`）：`MONGODB_URI`、`AUTH_SECRET`、`NODE_ENV` 等，`.env.example` 入库。

**本地运行**：`npm run dev` → http://localhost:3000 自查前台与 /admin。

---

## 9. 测试方案

| 层级 | 工具 | 范围 |
|---|---|---|
| 单元测试 | **Vitest** | models 校验、工具函数、md5 兼容登录逻辑 |
| 组件/集成 | **Testing Library** | 文章卡片、评论组件、表单 |
| E2E | **Playwright** | 关键链路：浏览文章→评论；登录→后台发文→前台可见 |
| 手动验收 | 清单 | SEO(查看 SSR HTML 源码)、移动端、暗黑模式等 |

CI（后续接 GitHub Actions）：lint + typecheck + 单测，PR 阻塞。

---

## 10. 构建与部署

### 10.1 流程（本机构建，ECS 仅运行）

```bash
# 本机（247G，构建机）
docker build -t myblog3:<tag> .
docker save myblog3:<tag> | gzip > myblog3_<tag>.tar.gz   # 约 80MB
scp myblog3_<tag>.tar.gz myblog:/tmp/

# ECS（2G，运行）
docker load < /tmp/myblog3_<tag>.tar.gz
docker rm -f myblog3 2>/dev/null
docker run -d --name myblog3 --restart=always \
  -p 127.0.0.1:3000:3000 --env-file /root/myblog3.env \
  --memory=350m myblog3:<tag>
docker image prune -f   # 清旧镜像
```

全部封装进 `deploy.sh`，一条命令完成。

### 10.2 Nginx 反代（改宝塔站点 conf，避免被覆盖）

在 `mangoya.cn` 站点配置里把 root 静态改为反代：

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

保留现有 443/证书配置；改完 `nginx -t && nginx -s reload`。

### 10.3 内存控制

- 容器 `--memory=350m` 限制；Next standalone 运行态约 150–250MB
- **替换而非新增**：上线验证后停老 pm2 `blog-server`(4 进程 ~160MB)+老前台，腾出内存，净占用基本持平
- 必要时观察 swap，避免 OOM

---

## 11. 上线切换与回滚

1. **灰度验证**：先用临时 location（如 `/v3-preview` 或临时端口）验证新容器，不影响现网。
2. **切换**：验证 OK → 把 `mangoya.cn` 的 `location /` 指向 3000。
3. **下线老服务**：`pm2 delete blog-server`，停老前台。
4. **回滚**：保留上一个可用镜像 tag + 旧 nginx conf 备份；异常时 `docker run` 旧 tag + 恢复 conf + reload，必要时重启老 pm2。

---

## 12. 风险与对策

| 风险 | 对策 |
|---|---|
| 内存仅 ~357MB | 替换而非新增；容器限内存；监控 swap |
| CentOS7 glibc 过老 | Docker 隔离运行时，宿主机不装 Node |
| Mongo 4.4 ↔ Mongoose 8 | 兼容（驱动支持 4.2+），上线前本地用 mongo:4.4 验证 |
| 简书图片防盗链 | 后续批量转存 OSS/本地（任务 10） |
| 宝塔覆盖 nginx 配置 | 改宝塔站点 conf 文件 + 备份；必要时用宝塔面板加规则 |
| 旧用户 md5 密码 | 登录兼容 md5，渐进升级 bcrypt |

---

## 13. 安全边界：绝不改动的现网服务

> 部署全程**只动博客相关**（mangoya.cn 站点 conf、3000 容器、aimeeblog 库）。以下一律不碰：

- 宝塔面板（BT-Panel, 28508）及其管理的 nginx/mysql
- **shotprompt.cn**（script-mvp docker + gunicorn:8003）
- **shadowbox / outline**（科学上网相关容器）
- watchtower、mysql(3306)、prometheus、其它 mangoya.cn / qinlh.com 子站点
- 其它 80/443 上的所有 server block（仅新增/修改 mangoya.cn 一段）

---

## 14. 待你确认 / 决策点

- 鉴权用 Auth.js 还是沿用自管 JWT？（默认：Auth.js）
- 前台是否要新增：暗黑模式 / 全文搜索 / RSS / 评论改 Giscus？（默认：先 1:1 复刻旧功能，再迭代）
- UI 风格：沿用旧视觉，还是重新设计一套？（默认：重做一套简洁现代风）
```
