export default function Footer() {
  return (
    <footer className="relative z-10 mt-24">
      <div className="bg-[#232323] px-3 py-5 text-center text-xs leading-relaxed text-[#888]">
        <p className="my-1">
          © {new Date().getFullYear()} Aimee&apos;s Blog · 基于 Next.js 重构
        </p>
        <p className="my-1">
          Made with{' '}
          <span
            className="inline-block text-brand-pink"
            style={{ animation: 'heartScale 1.33s ease-in-out infinite' }}
          >
            ♥
          </span>{' '}
          by Aimee
        </p>
      </div>
    </footer>
  );
}
