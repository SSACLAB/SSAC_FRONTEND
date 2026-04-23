import type { SearchResponse, SearchSuggestion } from '@/types';

export const searchService = {
  async search(query: string): Promise<SearchResponse> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('검색 요청에 실패했습니다.');
    return res.json() as Promise<SearchResponse>;
  },

  async suggest(query: string): Promise<SearchSuggestion[]> {
    const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions: SearchSuggestion[] };
    return data.suggestions;
  },

  async logSearch(keyword: string): Promise<void> {
    await fetch('/api/search/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    }).catch(() => {
      // 로그 실패는 무시
    });
  },
};
