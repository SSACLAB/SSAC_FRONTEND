import { homeService } from '@/services/home';
import { truncate } from '@/lib/utils';

export async function ContentSection() {
  const items = await homeService.getContent();

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">추천 콘텐츠</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              #{item.id}
            </span>
            <h3 className="mb-2 line-clamp-2 font-semibold capitalize text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">{truncate(item.body, 100)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
