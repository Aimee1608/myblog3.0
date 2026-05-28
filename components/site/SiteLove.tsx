'use client';

import { useState } from 'react';
import { toggleSiteLove } from '@/app/(public)/actions';

export default function SiteLove({ count }: { count: number }) {
  const [n, setN] = useState(count);
  const [active, setActive] = useState(false);

  const onClick = async () => {
    if (active) return;
    setActive(true);
    try {
      const res = await toggleSiteLove();
      if (res?.added) setN((v) => v + 1);
    } catch {
      /* ignore */
    }
    setTimeout(() => setActive(false), 1500);
  };

  return (
    <section className="card-box min-h-[120px] cursor-pointer text-center" onClick={onClick}>
      <p className="mt-1 text-xl font-medium text-brand-pink">Do you like me?</p>
      <div className="mt-1 flex items-center justify-center">
        <i className={`heart-sprite ${active ? 'active' : ''}`} />
        <span className="-ml-3 text-4xl text-brand-pink">{n}</span>
      </div>
    </section>
  );
}
