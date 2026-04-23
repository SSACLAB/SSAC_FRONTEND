/**
 * 검색 로그 수집 API
 *
 * POST /api/search/log
 * Body: { keyword: string }
 *
 * 개인 식별 불가 형태로 검색어를 저장합니다.
 * IP, 사용자 ID 등 식별 정보는 수집하지 않습니다.
 */

import { logSearchKeyword } from '@/lib/search-store';

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const keyword = typeof body?.keyword === 'string' ? body.keyword.trim() : '';

  if (!keyword || keyword.length > 50) {
    return Response.json({ success: false }, { status: 400 });
  }

  logSearchKeyword(keyword);

  return Response.json({ success: true });
}
