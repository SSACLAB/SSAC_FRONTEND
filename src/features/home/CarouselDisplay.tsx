'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCarouselTracking } from '@/hooks/useCarouselTracking';
import type { CarouselItem } from '@/types';

interface CarouselDisplayProps {
  items: CarouselItem[];
}

const AUTO_INTERVAL = 5000;
const PROGRESS_TICK = 100;

export function CarouselDisplay({ items }: CarouselDisplayProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  // 0으로 초기화 후 마운트 useEffect에서 실제 시각으로 설정 (렌더 중 Date.now() 호출 방지)
  const slideStartTimeRef = useRef<number>(0);
  const { trackImpression, trackClick, trackSwipe } = useCarouselTracking();

  // 슬라이드 시작 시각 초기화 (첫 마운트)
  useEffect(() => {
    slideStartTimeRef.current = Date.now();
  }, []);

  const total = items.length;

  // 슬라이드 변경 — 이전 슬라이드 체류시간 기록 후 인덱스 이동
  const navigate = useCallback(
    (targetIndex: number, via: 'manual' | 'swipe') => {
      const prev = items[currentIndex];
      if (prev) {
        const stayMs = Date.now() - slideStartTimeRef.current;
        trackImpression(prev.id, currentIndex, stayMs);
        if (via === 'swipe') trackSwipe(prev.id, currentIndex);
      }
      slideStartTimeRef.current = Date.now();
      setCurrentIndex((targetIndex + total) % total);
      setProgress(0);
    },
    [currentIndex, total, items, trackImpression, trackSwipe],
  );

  // 자동 슬라이드 + 프로그레스 바 (currentIndex 또는 isPaused 변경 시 타이머 재시작)
  useEffect(() => {
    if (total === 0 || isPaused) return;

    const step = 100 / (AUTO_INTERVAL / PROGRESS_TICK);

    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, PROGRESS_TICK);

    const slideTimer = setTimeout(() => {
      const ci = currentIndex;
      const current = items[ci];
      if (current) trackImpression(current.id, ci, AUTO_INTERVAL);
      slideStartTimeRef.current = Date.now();
      setCurrentIndex((prev) => (prev + 1) % total);
      setProgress(0);
    }, AUTO_INTERVAL);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [currentIndex, total, isPaused, items, trackImpression]);

  // 키보드 방향키 네비게이션
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(currentIndex - 1, 'manual');
      else if (e.key === 'ArrowRight') navigate(currentIndex + 1, 'manual');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, navigate]);

  // 터치 스와이프 지원
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]!.clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0]!.clientX;
    if (Math.abs(diff) > 50) navigate(currentIndex + (diff > 0 ? 1 : -1), 'swipe');
    touchStartXRef.current = null;
  };

  // CTA 딥링크 이동
  const handleCtaClick = (item: CarouselItem) => {
    trackClick(item.id, currentIndex);
    if (item.linkType === 'external') {
      window.open(item.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.linkUrl);
    }
  };

  if (total === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg"
      style={{ height: '22rem' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setProgress(0);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="주요 기능 소개 캐러셀"
    >
      {/* 슬라이드 목록 (position: absolute 페이드 전환) */}
      <div aria-live="polite" aria-atomic="true">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            style={{
              background: item.bgGradient ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            role="group"
            aria-label={`${i + 1}번째 슬라이드: ${item.title}`}
            aria-hidden={i !== currentIndex}
          >
            {/* 선택적 이미지 오버레이 */}
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
              />
            )}

            {/* 슬라이드 콘텐츠 */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
              {item.badge && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {item.badge}
                </span>
              )}

              <div className="mb-2 flex items-center gap-3">
                {/* {item.icon && (
                  <span className="text-5xl leading-none select-none" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                )} */}
                <h3 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl">
                  {item.title}
                </h3>
              </div>

              {item.subtitle && (
                <p className="mb-1.5 text-base font-medium text-white/90">{item.subtitle}</p>
              )}

              {item.description && (
                <p className="mb-5 max-w-lg text-sm text-white/70 line-clamp-2">
                  {item.description}
                </p>
              )}

              {item.ctaLabel && (
                <button
                  onClick={() => handleCtaClick(item)}
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-100"
                >
                  {item.ctaLabel}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={() => navigate(currentIndex - 1, 'manual')}
        aria-label="이전 슬라이드"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/25 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={() => navigate(currentIndex + 1, 'manual')}
        aria-label="다음 슬라이드"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/25 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 하단 컨트롤: 도트 + 슬라이드 번호 */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i !== currentIndex) navigate(i, 'manual');
            }}
            aria-label={`${i + 1}번째 슬라이드`}
            aria-current={i === currentIndex ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
        <span className="ml-1 text-xs font-medium tabular-nums text-white/60">
          {currentIndex + 1}&thinsp;/&thinsp;{total}
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
        <div
          className="h-full bg-white/50 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 일시정지 배지 (hover 시) */}
      {isPaused && (
        <div className="absolute right-3 top-3 z-20 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
          ❚❚&nbsp;일시정지
        </div>
      )}
    </div>
  );
}
