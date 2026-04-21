'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { QuizItem } from '@/types';

interface QuizCardProps {
  item: QuizItem;
}

export function QuizCard({ item }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-5 line-clamp-3 min-h-[4rem] text-sm font-semibold leading-relaxed text-gray-900">
        Q. {item.question}
      </p>
      <div className="space-y-2">
        {item.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === item.correctIndex;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setSelected(i)}
              className={cn(
                'w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors',
                !revealed &&
                  'border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50',
                revealed && isCorrect && 'border-green-500 bg-green-50 text-green-800',
                revealed && isSelected && !isCorrect && 'border-red-400 bg-red-50 text-red-700',
                revealed &&
                  !isSelected &&
                  !isCorrect &&
                  'border-gray-100 bg-gray-50 text-gray-400',
              )}
            >
              <span className="mr-2 font-medium">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="mt-3 text-xs text-gray-500">
          {selected === item.correctIndex ? '✅ 정답입니다!' : '❌ 오답입니다. A번이 정답입니다.'}
        </p>
      )}
    </div>
  );
}
