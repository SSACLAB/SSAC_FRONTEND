import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '마이페이지' };

const MY_MENU = [
  { label: '내 정보', href: '/my/profile', description: '프로필 및 학습 현황 보기' },
  { label: '설정', href: '/my/settings', description: '알림 및 환경 설정 변경' },
] as const;

export default function MyPage() {
  return (
    <div className="container-page py-16">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">마이페이지</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {MY_MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="mb-1 font-semibold text-gray-900">{item.label}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
