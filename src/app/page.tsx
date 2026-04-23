import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CarouselSection } from '@/features/home/CarouselSection';
import { QuizSection } from '@/features/home/QuizSection';
import { ContentSection } from '@/features/home/ContentSection';
import { NewsSection } from '@/features/home/NewsSection';
import {
  CarouselSkeleton,
  QuizSkeleton,
  ContentSkeleton,
  NewsSkeleton,
} from '@/features/home/HomeSkeleton';
import { SearchBar } from '@/features/home/SearchBar';

export const metadata: Metadata = {
  title: '홈',
};

// 각 요청마다 SSR + Streaming을 통해 Skeleton UI가 동작하도록 강제합니다.
// 프로덕션 전환 시: dynamic 제거 후 revalidate = 60 (ISR) 적용 권장.
export const dynamic = 'force-dynamic';

/**
 * 렌더링 전략: SSR + Streaming (Hybrid)
 *
 * - 페이지 셸(Hero)은 즉시 SSR 응답
 * - 각 섹션은 독립적인 Suspense 경계로 감싸져 병렬로 스트리밍됨
 * - 데이터 로딩 중에는 Skeleton UI를 표시
 * - BFF 집계 엔드포인트: GET /api/home (CSR 클라이언트용)
 */
export default function HomePage() {
  return (
    <div className="container-page py-12">
      {/* Hero — 정적 콘텐츠, 즉시 렌더링 */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          SSAC Frontend
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          Next.js · TypeScript · Tailwind CSS 기반의 Production-ready 스타터 템플릿
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar />
        </div>
      </section>

      {/*
       * 아래 4개 섹션은 각각 독립 Suspense 경계를 가집니다.
       * Next.js는 이 경계들을 병렬로 처리하여 각 섹션이 준비될 때마다 스트리밍합니다.
       * 느린 섹션이 빠른 섹션을 블록하지 않습니다.
       */}

      <Suspense fallback={<CarouselSkeleton />}>
        <CarouselSection />
      </Suspense>

      <Suspense fallback={<QuizSkeleton />}>
        <QuizSection />
      </Suspense>

      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection />
      </Suspense>

      <Suspense fallback={<NewsSkeleton />}>
        <NewsSection />
      </Suspense>
    </div>
  );
}
