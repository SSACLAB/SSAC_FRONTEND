import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NewsSection } from '@/features/home/NewsSection';
import { NewsSkeleton } from '@/features/home/HomeSkeleton';

export const metadata: Metadata = { title: '뉴스' };
export const dynamic = 'force-dynamic';

export default function NewsPage() {
  return (
    <div className="container-page py-12">
      <Suspense fallback={<NewsSkeleton />}>
        <NewsSection />
      </Suspense>
    </div>
  );
}
