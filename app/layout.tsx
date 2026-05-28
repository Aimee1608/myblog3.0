import type { Metadata } from 'next';
import './globals.css';
import 'highlight.js/styles/github.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mangoya.cn'),
  title: {
    default: "Aimee's Blog",
    template: "%s — Aimee's Blog",
  },
  description: '个人博客 3.0 — 记录前端、全栈与 AI 工具的折腾',
  verification: {
    google: 'qV-FW1KZKZbcdiDrWjceg02YKzS1UGZoKxvA_3w6n7M',
  },
  openGraph: {
    type: 'website',
    siteName: "Aimee's Blog",
    locale: 'zh_CN',
    url: 'https://mangoya.cn',
    title: "Aimee's Blog",
    description: '个人博客 3.0 — 记录前端、全栈与 AI 工具的折腾',
    images: [{ url: '/img/headbg05.jpg', width: 1200, height: 630, alt: "Aimee's Blog" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aimee's Blog",
    description: '个人博客 3.0 — 记录前端、全栈与 AI 工具的折腾',
    images: ['/img/headbg05.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
