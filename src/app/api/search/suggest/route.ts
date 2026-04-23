/**
 * 검색 자동완성 API
 *
 * GET /api/search/suggest?q=<query>
 *
 * 인기 검색어 집계 데이터 + 정적 금융 키워드에서 최대 5개 추천합니다.
 */

import { getPopularKeywords } from '@/lib/search-store';
import type { SearchSuggestion } from '@/types';

const STATIC_KEYWORDS = [
  '주식',
  '채권',
  '펀드',
  '부동산',
  '보험',
  '세금',
  '퇴직연금',
  '암호화폐',
  '환율',
  '대출',
  '금리',
  '배당',
  '포트폴리오',
  '재테크',
  '저축',
];

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';

  if (!q) {
    return Response.json({ suggestions: [] });
  }

  const lq = q.toLowerCase();

  // 인기 검색어 중 접두사 일치
  const popular = getPopularKeywords(20);
  const popularMatches: SearchSuggestion[] = popular
    .filter(({ keyword }) => keyword.startsWith(lq) && keyword !== lq)
    .slice(0, 5);

  // 정적 키워드로 부족한 개수 채우기
  const staticMatches = STATIC_KEYWORDS.filter(
    (kw) =>
      kw.startsWith(q) && kw !== q && !popularMatches.some((p) => p.keyword === kw.toLowerCase()),
  ).map((kw) => ({ keyword: kw, count: 0 }));

  const suggestions = [...popularMatches, ...staticMatches].slice(0, 5);

  return Response.json({ suggestions });
}
