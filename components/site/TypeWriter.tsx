'use client';

import { useEffect, useState } from 'react';

// Stable default reference so the effect below isn't restarted on every render.
const DEFAULT_PHRASES = ['Hello!', 'Hi, Aimee'];

// Simple typewriter: types each phrase, deletes it, moves to the next, loops.
export default function TypeWriter({
  phrases = DEFAULT_PHRASES,
}: {
  phrases?: string[];
}) {
  const [text, setText] = useState('');

  useEffect(() => {
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phrase];
      if (!deleting) {
        char++;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 180);
      } else {
        char--;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(tick, 500);
          return;
        }
        timer = setTimeout(tick, 90);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [phrases]);

  return (
    <>
      {text}
      <span
        className="ml-1 inline-block"
        style={{ animation: 'blinkCaret 0.6s step-end infinite' }}
      >
        |
      </span>
    </>
  );
}
