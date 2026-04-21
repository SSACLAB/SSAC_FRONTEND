'use client';

import { useEffect, useState } from 'react';
import type { CarouselItem } from '@/types';

interface CarouselDisplayProps {
  items: CarouselItem[];
}

export function CarouselDisplay({ items }: CarouselDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = items.length;

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  const current = items[currentIndex];
  if (!current) return null;

  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-100" style={{ height: '18rem' }}>
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current.id}
        src={current.imageUrl}
        alt={current.title}
        className="h-full w-full object-cover transition-opacity duration-500"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Title */}
      <div className="absolute bottom-12 left-6 right-16">
        <p className="line-clamp-1 text-lg font-semibold capitalize text-white">{current.title}</p>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="이전"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="다음"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`${i + 1}번째 슬라이드`}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
