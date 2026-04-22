'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getNextRound } from '@/data/quiz-data';
import type { QuizItem, QuizAttempt, QuizSession } from '@/types';

interface QuizWidgetProps {
  pool: QuizItem[];
}

type Phase = 'answering' | 'revealed' | 'complete';

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-2.5 rounded-full transition-all duration-300',
            i < current
              ? 'w-2.5 bg-blue-500'
              : i === current
                ? 'w-6 bg-blue-500'
                : 'w-2.5 bg-gray-200',
          )}
        />
      ))}
    </div>
  );
}

function ResultScreen({
  score,
  total,
  attempts,
  items,
  onRetry,
}: {
  score: number;
  total: number;
  attempts: QuizAttempt[];
  items: QuizItem[];
  onRetry: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct === 100 ? '🏆' : pct >= 66 ? '🎉' : pct >= 33 ? '🤔' : '📚';

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="text-5xl">{emoji}</div>
      <div>
        <p className="text-3xl font-bold text-gray-900">
          {score} / {total}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {pct === 100
            ? '완벽해요! 금융 고수네요 👏'
            : pct >= 66
              ? '잘했어요! 조금만 더 공부해봐요'
              : pct >= 33
                ? '괜찮아요, 오늘 배운 것만으로도 성장했어요'
                : '금융 개념을 차근차근 익혀봐요 💪'}
        </p>
      </div>

      <div className="w-full space-y-2">
        {attempts.map((attempt, idx) => {
          const quiz = items[idx];
          if (!quiz) return null;
          return (
            <div
              key={quiz.id}
              className={cn(
                'flex items-start gap-3 rounded-lg px-4 py-3 text-left text-sm',
                attempt.isCorrect ? 'bg-emerald-50' : 'bg-rose-50',
              )}
            >
              <span className="mt-0.5 shrink-0 text-base">{attempt.isCorrect ? '✅' : '❌'}</span>
              <p className="line-clamp-2 text-gray-700">{quiz.question}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRetry}
        className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-95"
      >
        다시 풀기
      </button>
    </div>
  );
}

export function QuizWidget({ pool }: QuizWidgetProps) {
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [currentItems, setCurrentItems] = useState<QuizItem[]>(() => getNextRound(pool, []));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sessions, setSessions] = useLocalStorage<QuizSession[]>('quiz_sessions', []);

  const current = currentItems[currentIdx];
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;

  const handleSelect = useCallback(
    async (optionIdx: number) => {
      if (phase !== 'answering' || isSubmitting || !current) return;
      setSelected(optionIdx);
      setIsSubmitting(true);

      try {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId: current.id, selectedIndex: optionIdx }),
        });
        const data = (await res.json()) as { isCorrect: boolean };
        setAttempts((prev) => [
          ...prev,
          {
            quizId: current.id,
            selectedIndex: optionIdx,
            isCorrect: data.isCorrect,
            answeredAt: new Date().toISOString(),
          },
        ]);
      } catch {
        setAttempts((prev) => [
          ...prev,
          {
            quizId: current.id,
            selectedIndex: optionIdx,
            isCorrect: optionIdx === current.correctIndex,
            answeredAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSubmitting(false);
        setPhase('revealed');
      }
    },
    [phase, isSubmitting, current],
  );

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= currentItems.length) {
      const score = attempts.filter((a) => a.isCorrect).length;
      const session: QuizSession = {
        sessionId: `${Date.now()}`,
        date: new Date().toISOString(),
        attempts,
        score,
        total: currentItems.length,
      };
      setSessions([session, ...sessions.slice(0, 49)]);
      setPhase('complete');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setPhase('answering');
    }
  }, [currentIdx, currentItems.length, attempts, sessions, setSessions]);

  const handleRetry = useCallback(() => {
    // 이번 라운드 문제 ID를 seenIds에 추가, 전부 소진되면 초기화
    const nextSeenIds =
      seenIds.length + currentItems.length >= pool.length
        ? []
        : [...seenIds, ...currentItems.map((q) => q.id)];

    setSeenIds(nextSeenIds);
    setCurrentItems(getNextRound(pool, nextSeenIds));
    setCurrentIdx(0);
    setPhase('answering');
    setSelected(null);
    setAttempts([]);
  }, [seenIds, currentItems, pool]);

  const lastAttempt = attempts[attempts.length - 1];
  const isCorrectAnswer = lastAttempt?.isCorrect ?? false;

  if (phase === 'complete') {
    return (
      <ResultScreen
        score={totalCorrect}
        total={currentItems.length}
        attempts={attempts}
        items={currentItems}
        onRetry={handleRetry}
      />
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <ProgressDots total={currentItems.length} current={currentIdx} />
        <span className="text-xs font-medium text-gray-400">
          {currentIdx + 1} / {currentItems.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {current.category}
        </span>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            DIFFICULTY_COLOR[current.difficulty],
          )}
        >
          {DIFFICULTY_LABEL[current.difficulty]}
        </span>
      </div>

      <p className="text-base font-semibold leading-relaxed text-gray-900 sm:text-lg">
        Q{currentIdx + 1}. {current.question}
      </p>

      <div className="space-y-2.5">
        {current.options.map((option: string, i: number) => {
          const isSelected = selected === i;
          const isCorrect = i === current.correctIndex;
          const revealed = phase === 'revealed';

          return (
            <button
              key={i}
              disabled={revealed || isSubmitting}
              onClick={() => handleSelect(i)}
              className={cn(
                'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                !revealed &&
                  'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 active:scale-[0.99]',
                revealed && isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                revealed && isSelected && !isCorrect && 'border-rose-400 bg-rose-50 text-rose-700',
                revealed && !isSelected && !isCorrect && 'border-gray-100 bg-gray-50 text-gray-400',
                isSubmitting && 'cursor-wait opacity-60',
              )}
            >
              <span className="mr-2.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {revealed && isCorrect && <span className="ml-2 text-emerald-600">✓</span>}
              {revealed && isSelected && !isCorrect && (
                <span className="ml-2 text-rose-500">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {phase === 'revealed' && (
        <div
          className={cn(
            'rounded-xl border-l-4 p-4 text-sm leading-relaxed',
            isCorrectAnswer
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
              : 'border-rose-400 bg-rose-50 text-rose-900',
          )}
        >
          <p className="mb-1 font-semibold">
            {isCorrectAnswer ? '🎉 정답이에요!' : '💡 아쉽지만 괜찮아요!'}
          </p>
          <p className="text-gray-700">{current.explanation}</p>
        </div>
      )}

      {phase === 'revealed' && (
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.99]"
        >
          {currentIdx + 1 >= currentItems.length ? '결과 보기 →' : '다음 문제 →'}
        </button>
      )}
    </div>
  );
}
