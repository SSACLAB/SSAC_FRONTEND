import { homeService } from '@/services/home';
import type { NewsSortType } from '@/types';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const rawSort = searchParams.get('sort');
  const sort: NewsSortType = rawSort === 'importance' ? 'importance' : 'latest';

  try {
    const items = await homeService.getNews(sort);
    return Response.json(items);
  } catch {
    return Response.json({ error: '뉴스를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
