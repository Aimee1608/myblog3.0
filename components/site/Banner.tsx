import TypeWriter from './TypeWriter';

export default function Banner() {
  return (
    <div
      className="relative h-[60vh] min-h-[420px] w-full bg-cover bg-center"
      style={{ backgroundImage: 'url(/img/headbg05.jpg)' }}
    >
      {/* 打字机大标题 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="font-display text-5xl text-white md:text-8xl"
          style={{ textShadow: '1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0' }}
        >
          <TypeWriter />
        </h1>
      </div>

      {/* 底部信息卡 */}
      <div
        className="absolute -bottom-14 left-1/2 w-[88%] max-w-3xl -translate-x-1/2 rounded-md py-8 text-center"
        style={{ background: 'rgba(230,244,249,0.85)', animation: 'cardRise 0.6s ease-out' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/tou.png"
          alt="Aimee"
          className="mx-auto h-24 w-24 rounded-full object-cover transition-transform duration-500 hover:[transform:rotate(360deg)]"
        />
        <p
          className="mt-4 text-lg font-bold text-brand-blue"
          style={{ textShadow: '0 0 3px #fff, 0 0 6px #fff' }}
        >
          Write the Code. Change the World.
        </p>
      </div>
    </div>
  );
}
