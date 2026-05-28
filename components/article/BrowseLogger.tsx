'use client';

import { useEffect } from 'react';

// Fires a single browse record per (sessionStorage tab × articleId), to avoid
// inflating counts on refresh / hot-reload. SSR / crawlers do not run useEffect
// so they don't count.
export default function BrowseLogger({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `browsed:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* sessionStorage may be unavailable in private mode — fall through */
    }
    fetch('/api/browse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
      keepalive: true,
    }).catch(() => {
      /* ignore network errors */
    });
  }, [articleId]);

  return null;
}
