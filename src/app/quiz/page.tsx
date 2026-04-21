import { Suspense } from 'react';
import type { Metadata } from 'next';
import { QuizSection } from '@/features/home/QuizSection';
import { QuizSkeleton } from '@/features/home/HomeSkeleton';

export const metadata: Metadata = { title: '퀴즈' };
export const dynamic = 'force-dynamic';

export default function QuizPage() {
  return (
    <div className="container-page py-12">
      <Suspense fallback={<QuizSkeleton />}>
        <QuizSection />
      </Suspense>
    </div>
  );
}
