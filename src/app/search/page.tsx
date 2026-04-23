import type { Metadata } from 'next';
import type { SearchResponse } from '@/types';
import { SearchBar } from '@/features/home/SearchBar';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `"${q}" 검색 결과` : '검색' };
}

async function fetchSearchResults(q: string): Promise<SearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('검색 실패');
  return res.json() as Promise<SearchResponse>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  let data: SearchResponse | null = null;
  if (query) {
    data = await fetchSearchResults(query).catch(() => null);
  }

  return (
    <div className="container-page py-12">
      {/* 검색 입력창 */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* 검색어가 없는 경우 */}
      {!query && (
        <p className="text-center text-gray-500">검색어를 입력하여 금융 콘텐츠를 탐색하세요.</p>
      )}

      {/* 검색 결과 */}
      {query && data && (
        <>
          <p className="mb-6 text-sm text-gray-500">
            <span className="font-semibold text-gray-900">&ldquo;{data.query}&rdquo;</span> 검색
            결과 {data.total}건
          </p>

          {data.results.length === 0 ? (
            <EmptyResult query={query} popularKeywords={data.popularKeywords} />
          ) : (
            <SearchResultList results={data.results} />
          )}
        </>
      )}
    </div>
  );
}

// -------------------------------------------------------
// Sub-components
// -------------------------------------------------------

function SearchResultList({ results }: { results: SearchResponse['results'] }) {
  return (
    <ul className="space-y-4">
      {results.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {item.category}
            </span>
          </div>
          <h2 className="mb-1 font-semibold capitalize text-gray-900">{item.title}</h2>
          <p className="text-sm leading-relaxed text-gray-500">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function EmptyResult({
  query,
  popularKeywords,
}: {
  query: string;
  popularKeywords: SearchResponse['popularKeywords'];
}) {
  return (
    <div className="text-center">
      <p className="mb-2 text-lg font-semibold text-gray-700">검색 결과가 없습니다.</p>
      <p className="mb-8 text-sm text-gray-400">
        &ldquo;{query}&rdquo;에 대한 콘텐츠를 찾을 수 없습니다.
      </p>

      {popularKeywords.length > 0 && (
        <div className="mx-auto max-w-sm">
          <p className="mb-3 text-sm font-medium text-gray-600">인기 검색어</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularKeywords.map((kw) => (
              <a
                key={kw.keyword}
                href={`/search?q=${encodeURIComponent(kw.keyword)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {kw.keyword}
              </a>
            ))}
          </div>
        </div>
      )}

      {popularKeywords.length === 0 && (
        <div className="mx-auto max-w-sm">
          <p className="mb-3 text-sm font-medium text-gray-600">추천 검색어</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['주식', '채권', '펀드', '보험', '재테크'].map((kw) => (
              <a
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
