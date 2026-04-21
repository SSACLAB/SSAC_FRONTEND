import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContentSection } from '@/features/home/ContentSection';
import { ContentSkeleton } from '@/features/home/HomeSkeleton';

export const metadata: Metadata = { title: '콘텐츠' };
export const dynamic = 'force-dynamic';

export default function ContentPage() {
  return (
    <div className="container-page py-12">
      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection />
      </Suspense>
    </div>
  );
}
