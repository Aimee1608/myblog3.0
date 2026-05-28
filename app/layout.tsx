import type { Metadata } from 'next';
import './globals.css';
import 'highlight.js/styles/github.css';

export const metadata: Metadata = {
  title: 'Aimee 的博客',
  description: '个人博客 3.0 — 基于 Next.js 重构',
  verification: {
    google: 'qV-FW1KZKZbcdiDrWjceg02YKzS1UGZoKxvA_3w6n7M',
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
