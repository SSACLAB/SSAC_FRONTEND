import { homeService } from '@/services/home';
import { formatDate } from '@/lib/utils';

export async function NewsSection() {
  const items = await homeService.getNews();

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">뉴스</h2>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors">
            {/* Color-coded index badge as image placeholder */}
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-2xl font-bold text-white"
              style={{ backgroundColor: BADGE_COLORS[i % BADGE_COLORS.length] }}
            >
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 line-clamp-1 font-semibold capitalize text-gray-900">
                {item.title}
              </h3>
              <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {item.summary}
              </p>
              <time
                dateTime={item.publishedAt}
                className="text-xs text-gray-400"
              >
                {formatDate(item.publishedAt)}
              </time>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const BADGE_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#059669'];
