'use client';

import { useEffect, useState } from 'react';

// Scroll-to-top kitty (scroll.png), shows after scrolling down 600px.
export default function ToTopCat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      setShow(t > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 cursor-pointer transition-opacity duration-300 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      title="回到顶部"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/scroll.png" alt="回到顶部" className="w-16" />
    </div>
  );
}
