/**
 * Header — Server Component
 *
 * 렌더링 전략:
 * - 이 컴포넌트 자체는 Server Component (즉시 SSR, JS 없음)
 * - 인터랙티브 요소(DesktopNav, MobileMenu)만 Client Component로 분리
 * - sticky + backdrop-blur + 고정 h-16으로 Layout Shift 방지
 * - 메뉴 데이터는 lib/navigation.ts 정적 정의 → 캐시/재요청 없음
 */

import Link from 'next/link';
import { env } from '@/lib/env';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
          aria-label={`${env.appName} 홈으로 이동`}
        >
          {env.appName}
        </Link>

        {/* 데스크톱 네비게이션 (md 이상) */}
        <DesktopNav />

        {/* 모바일 햄버거 메뉴 (md 미만) */}
        <MobileMenu appName={env.appName} />
      </div>
    </header>
  );
}
