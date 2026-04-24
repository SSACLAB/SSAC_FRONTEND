/**
 * GET /api/carousel
 * 홈 캐러셀 아이템 목록을 반환합니다.
 */

import { homeService } from '@/services/home';

export async function GET(): Promise<Response> {
  const items = await homeService.getCarousel();

  return Response.json(
    { success: true, data: items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
