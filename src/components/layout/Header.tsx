import Link from 'next/link';
import { env } from '@/lib/env';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600">
          {env.appName}
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            홈
          </Link>
          <Link href="/posts" className="hover:text-gray-900">
            포스트
          </Link>
        </nav>
      </div>
    </header>
  );
}
