'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/navigation';

// ── Inline SVG helpers ──────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronRight({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-90')}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ── MobileMenu ───────────────────────────────────────────────────────────────

export function MobileMenu({ appName }: { appName: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // 라우트 변경 시 메뉴 닫기
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setExpanded(null);
  }

  // 메뉴 열릴 때 body 스크롤 잠금 + 포커스 이동
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape 키로 메뉴 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const toggleExpanded = (href: string) => {
    setExpanded((prev) => (prev === href ? null : href));
  };

  return (
    <div className="md:hidden">
      {/* 햄버거 토글 버튼 */}
      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* createPortal을 사용하여 헤더의 CSS 제약(backdrop-blur)에서 탈출합니다.
        z-index를 100 이상으로 주어 다른 고정 요소들보다 확실히 위에 오도록 보장합니다.
      */}
      {mounted &&
        createPortal(
          <div className="md:hidden">
            {/* 백드롭 */}
            {isOpen && (
              <div
                aria-hidden="true"
                className="fixed inset-0 z-[100] bg-black/40"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* 드로어 패널 */}
            <div
              id="mobile-nav-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="메뉴"
              className={cn(
                'fixed inset-y-0 right-0 z-[110] flex w-72 flex-col bg-white transition-all duration-300',
                isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none',
              )}
            >
              {/* 드로어 헤더 */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                <span className="text-base font-bold text-gray-900">{appName}</span>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* 메뉴 아이템 */}
              <nav aria-label="모바일 메뉴" className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    const isExpanded = expanded === item.href;

                    if (!item.children) {
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              active
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                            )}
                          >
                            <NavIcon path={item.iconPath} />
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpanded(item.href)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            active || isExpanded
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                          )}
                        >
                          <NavIcon path={item.iconPath} />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronRight open={isExpanded} />
                        </button>

                        {isExpanded && (
                          <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                            {item.children.map((child) => {
                              const childActive = pathname === child.href;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    aria-current={childActive ? 'page' : undefined}
                                    className={cn(
                                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                                      childActive
                                        ? 'font-medium text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function NavIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 flex-shrink-0"
    >
      <path d={path} />
    </svg>
  );
}
