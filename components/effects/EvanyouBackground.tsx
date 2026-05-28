'use client';

import { useEffect, useRef } from 'react';

// Ported from the old blog's evanyou.js: a colorful triangular wave band
// painted on a full-screen canvas behind everything. Repaints on click/resize.
export default function EvanyouBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const x = c.getContext('2d');
    if (!x) return;

    const m = Math;
    const u = m.PI * 2;
    const v = m.cos;
    const z = m.random;
    let w = 0;
    let h = 0;
    const f = 90;
    let r = 0;

    const pr = window.devicePixelRatio || 1;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      c!.width = w * pr;
      c!.height = h * pr;
      x!.setTransform(pr, 0, 0, pr, 0, 0);
      x!.globalAlpha = 0.6;
    }

    function y(p: number): number {
      const t = p + (z() * 2 - 1.1) * f;
      return t > h || t < 0 ? y(p) : t;
    }

    function d(i: { x: number; y: number }, j: { x: number; y: number }) {
      x!.beginPath();
      x!.moveTo(i.x, i.y);
      x!.lineTo(j.x, j.y);
      const k = j.x + (z() * 2 - 0.25) * f;
      const n = y(j.y);
      x!.lineTo(k, n);
      x!.closePath();
      r -= u / -50;
      x!.fillStyle =
        '#' +
        (
          ((v(r) * 127 + 128) << 16) |
          ((v(r + u / 3) * 127 + 128) << 8) |
          (v(r + (u / 3) * 2) * 127 + 128)
        ).toString(16);
      x!.fill();
      q[0] = q[1];
      q[1] = { x: k, y: n };
    }

    let q: { x: number; y: number }[] = [];
    function draw() {
      x!.clearRect(0, 0, w, h);
      q = [
        { x: 0, y: h * 0.7 + f },
        { x: 0, y: h * 0.7 - f },
      ];
      while (q[1].x < w + f) d(q[0], q[1]);
    }

    resize();
    draw();

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('click', draw);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('click', draw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full"
      style={{ background: '#efefef' }}
    />
  );
}
