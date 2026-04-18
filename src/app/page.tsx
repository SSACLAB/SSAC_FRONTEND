import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '홈',
};

const features = [
  {
    title: 'Next.js 15 App Router',
    description: '최신 React Server Components와 Streaming을 활용한 빠른 렌더링',
    icon: '⚡',
  },
  {
    title: 'TypeScript Strict Mode',
    description: '완전한 타입 안전성으로 런타임 오류를 컴파일 타임에 방지',
    icon: '🔒',
  },
  {
    title: 'Tailwind CSS v4',
    description: '유틸리티 우선 CSS 프레임워크로 빠른 UI 개발',
    icon: '🎨',
  },
  {
    title: 'Feature-based Structure',
    description: '확장 가능한 기능 단위 디렉토리 구조로 팀 협업 최적화',
    icon: '📁',
  },
];

export default function HomePage() {
  return (
    <div className="container-page py-16">
      {/* Hero */}
      <section className="mb-20 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          SSAC Frontend
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
          Next.js · TypeScript · Tailwind CSS 기반의 Production-ready 스타터 템플릿
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/posts">
            <Button size="lg">포스트 보기</Button>
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              문서 보기
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">주요 특징</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="mb-3 block text-3xl">{feature.icon}</span>
              <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
