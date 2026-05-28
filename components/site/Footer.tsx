export default function Footer() {
  return (
    <footer className="relative z-10 mt-24">
      <div className="bg-[#232323] px-3 py-5 text-center text-xs leading-relaxed text-[#888]">
        <p className="my-2 flex items-center justify-center gap-4">
          <a
            href="/rss.xml"
            title="RSS 订阅"
            className="inline-flex items-center gap-1 transition-colors hover:text-[#f4692c]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
            </svg>
            RSS
          </a>
          <a
            href="https://github.com/Aimee1608"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="inline-flex items-center gap-1 transition-colors hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </p>
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
