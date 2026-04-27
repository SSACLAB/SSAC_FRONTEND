import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * GET /api/auth/kakao?redirectTo=...
 * Spring Security OAuth2 카카오 로그인 시작 엔드포인트로 프록시하는 BFF.
 * BE가 카카오 OAuth URL 생성 및 콜백 처리를 모두 담당한다.
 */
export async function GET(request: NextRequest) {
  const backendUrl = process.env.API_BASE_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirectTo');

  const kakaoUrl = new URL('/oauth2/authorization/kakao', backendUrl);
  if (redirectTo && redirectTo !== '/') {
    kakaoUrl.searchParams.set('redirectTo', redirectTo);
  }

  return NextResponse.redirect(kakaoUrl.toString());
}
