/**
 * 검색어 인메모리 스토어
 *
 * 개인 식별 불가 형태로 검색어를 집계합니다.
 * 프로덕션 환경에서는 Redis 또는 DB로 교체하세요.
 */

const searchLogStore = new Map<string, number>();

export function logSearchKeyword(keyword: string): void {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return;
  searchLogStore.set(normalized, (searchLogStore.get(normalized) ?? 0) + 1);
}

export function getPopularKeywords(limit = 5): Array<{ keyword: string; count: number }> {
  return [...searchLogStore.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}
