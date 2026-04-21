'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/navigation';
import type { NavItem } from '@/lib/navigation';

// ── Inline SVG helpers (nav-only, no abstraction layer needed) ──────────────

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
      className="h-4 w-4 flex-shrink-0"
    >
      <path d={path} />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        'h-3 w-3 flex-shrink-0 transition-transform duration-150',
        open && 'rotate-180',
      )}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── DesktopNav ───────────────────────────────────────────────────────────────

export function DesktopNav() {
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // href === '/' は完全一致、他はプレフィックス一致
  const isActive = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname.startsWith(href + '/');
    },
    [pathname],
  );

  const openMenu = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenItem(href);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenItem(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // 드롭다운 컨테이너 바깥으로 포커스가 이동하면 닫기
  const onContainerBlur = (e: React.FocusEvent<HTMLDivElement>, href: string) => {
    const relatedTarget = e.relatedTarget;
    if (!(relatedTarget instanceof Node) || !e.currentTarget.contains(relatedTarget)) {
      if (openItem === href) setOpenItem(null);
    }
  };

  // 트리거 버튼 키보드 핸들러
  const onTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
    if (!item.children) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setOpenItem((prev) => (prev === item.href ? null : item.href));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setOpenItem(item.href);
        // 첫 번째 드롭다운 링크로 포커스 이동
        requestAnimationFrame(() => {
          const dropdown = document.getElementById(dropdownId(item.href));
          dropdown?.querySelector<HTMLElement>('a')?.focus();
        });
        break;
      case 'Escape':
        setOpenItem(null);
        break;
    }
  };

  // 드롭다운 링크 키보드 핸들러
  const onItemKey = (e: React.KeyboardEvent<HTMLAnchorElement>, parentHref: string) => {
    const dropdown = document.getElementById(dropdownId(parentHref));
    const links = dropdown ? Array.from(dropdown.querySelectorAll<HTMLElement>('a')) : [];
    const idx = links.indexOf(e.currentTarget);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpenItem(null);
        triggerRefs.current.get(parentHref)?.focus();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        const next = links[idx + 1];
        if (next) next.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (idx === 0) {
          triggerRefs.current.get(parentHref)?.focus();
        } else {
          const prev = links[idx - 1];
          if (prev) prev.focus();
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const first = links[0];
        if (first) first.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = links[links.length - 1];
        if (last) last.focus();
        break;
      }
    }
  };

  return (
    <nav aria-label="주요 메뉴" className="hidden items-center gap-0.5 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const isOpen = openItem === item.href;

        // 하위 메뉴 없는 단순 링크
        if (!item.children) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <NavIcon path={item.iconPath} />
              {item.label}
            </Link>
          );
        }

        // 하위 메뉴 있는 드롭다운 트리거
        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => openMenu(item.href)}
            onMouseLeave={scheduleClose}
            onFocus={cancelClose}
            onBlur={(e) => onContainerBlur(e, item.href)}
          >
            <button
              ref={(el) => {
                if (el) triggerRefs.current.set(item.href, el);
                else triggerRefs.current.delete(item.href);
              }}
              type="button"
              aria-expanded={isOpen}
              onKeyDown={(e) => onTriggerKey(e, item)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active || isOpen
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <NavIcon path={item.iconPath} />
              {item.label}
              <Chevron open={isOpen} />
            </button>

            {isOpen && (
              <ul
                id={dropdownId(item.href)}
                className="absolute left-0 top-full z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
              >
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        aria-current={childActive ? 'page' : undefined}
                        onKeyDown={(e) => onItemKey(e, item.href)}
                        onClick={() => setOpenItem(null)}
                        className={cn(
                          'block px-4 py-2.5 transition-colors',
                          childActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        )}
                      >
                        <span className="block text-sm font-medium">{child.label}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {child.description}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function dropdownId(href: string): string {
  return `nav-dropdown-${href.replaceAll('/', '') || 'home'}`;
}
