'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/** BE가 OAuth 실패 시 전달하는 error 쿼리 파라미터 값 → 표시 메시지 매핑 */
const ERROR_MESSAGES: Record<string, string> = {
  KAKAO_AUTH_FAILED: '카카오 인증에 실패했습니다. 다시 시도해주세요.',
  KAKAO_AUTH_CANCEL: '카카오 로그인이 취소되었습니다.',
  SERVER_ERROR: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const errorCode = searchParams.get('error');

  const [isMockLoading, setIsMockLoading] = useState(false);
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);

  const isLoading = isMockLoading || isKakaoLoading;

  const errorMessage = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? '오류가 발생했습니다. 다시 시도해주세요.')
    : null;

  const handleKakaoLogin = () => {
    if (isLoading) return;
    setIsKakaoLoading(true);
    const params = new URLSearchParams({ redirectTo });
    window.location.href = `/api/auth/kakao?${params.toString()}`;
    // 페이지 이동 전까지 버튼 비활성화 유지 (중복 클릭 방지)
  };

  const handleMockLogin = async () => {
    if (isLoading) return;
    setIsMockLoading(true);
    try {
      await fetch('/api/auth/login', { method: 'POST' });
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsMockLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}

      {/* 카카오 로그인 버튼 (카카오 브랜드 가이드 준수) */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={isLoading}
        aria-label="카카오 로그인"
        className="flex h-[45px] w-full items-center justify-center gap-[6px] rounded-xl bg-[#FEE500] text-[15px] font-medium text-[#000000D9] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isKakaoLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00000040] border-t-[#000000D9]" />
        ) : (
          <KakaoSymbol />
        )}
        {isKakaoLoading ? '로그인 중...' : '카카오 로그인'}
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">또는</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="mb-3 text-center text-xs text-gray-400">
        현재 목 로그인입니다. 버튼 클릭 시 인증 쿠키가 설정됩니다.
      </p>
      <Button
        className="w-full"
        onClick={handleMockLogin}
        isLoading={isMockLoading}
        disabled={isLoading}
      >
        로그인 (목)
      </Button>
    </div>
  );
}

/** 카카오 공식 심볼 마크 SVG */
function KakaoSymbol() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C4.85786 1.5 1.5 4.21634 1.5 7.57143C1.5 9.65169 2.74364 11.4989 4.66071 12.6027L3.80357 15.8036C3.73036 16.0714 4.03393 16.2857 4.26786 16.1339L8.08036 13.6875C8.38393 13.7143 8.6875 13.7143 9 13.7143C13.1421 13.7143 16.5 11 16.5 7.57143C16.5 4.21634 13.1421 1.5 9 1.5Z"
        fill="#1A1A1A"
      />
    </svg>
  );
}
