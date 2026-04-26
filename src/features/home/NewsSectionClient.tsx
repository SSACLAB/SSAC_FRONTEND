'use client';

import { useState, useCallback } from 'react';
import type { NewsItem, NewsSortType } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

const SORT_LABELS: Record<NewsSortType, string> = {
  latest: '최신순',
  importance: '중요도순',
};

interface Props {
  initialItems: NewsItem[];
  initialError?: boolean;
}

export function NewsSectionClient({ initialItems, initialError = false }: Props) {
  const [sort, setSort] = useState<NewsSortType>('latest');
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const fetchNews = useCallback(async (sortType: NewsSortType) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/news?sort=${sortType}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as NewsItem[];
      setItems(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSortChange = (newSort: NewsSortType) => {
    if (newSort === sort) return;
    setSort(newSort);
    void fetchNews(newSort);
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">금융 뉴스</h2>
        <SortTabs sort={sort} onChange={handleSortChange} />
      </div>

      {loading && <NewsListSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          뉴스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center text-sm text-gray-500">
          표시할 뉴스가 없습니다.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function SortTabs({ sort, onChange }: { sort: NewsSortType; onChange: (s: NewsSortType) => void }) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      {(Object.keys(SORT_LABELS) as NewsSortType[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            sort === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-pressed={sort === key}
        >
          {SORT_LABELS[key]}
        </button>
      ))}
    </div>
  );
}

function NewsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-5 w-16 rounded-full bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
          <div className="mb-1 h-5 w-full rounded bg-gray-200" />
          <div className="mb-3 h-5 w-5/6 rounded bg-gray-200" />
          <div className="mb-1 h-4 w-full rounded bg-gray-200" />
          <div className="mb-1 h-4 w-full rounded bg-gray-200" />
          <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {item.category}
        </span>
        <span className="text-xs text-gray-400">{item.source}</span>
      </div>
      <h3 className="line-clamp-2 font-semibold capitalize leading-snug text-gray-900">
        {item.title}
      </h3>
      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">{item.summary}</p>
      <time dateTime={item.publishedAt} className="mt-auto text-xs text-gray-400">
        {formatRelativeTime(item.publishedAt)}
      </time>
    </article>
  );
}
