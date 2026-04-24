/**
 * POST /api/carousel/track  — 캐러셀 행동 이벤트 수집 (노출·클릭·스와이프)
 * GET  /api/carousel/track  — 아이템별 CTR·평균 체류시간 통계 조회
 */

import { recordCarouselEvent, getCarouselStats } from '@/lib/carousel-store';
import type { CarouselTrackEvent } from '@/types';

export async function POST(request: Request): Promise<Response> {
  let body: Partial<CarouselTrackEvent>;

  try {
    body = (await request.json()) as Partial<CarouselTrackEvent>;
  } catch {
    return Response.json({ success: false, message: '잘못된 JSON 형식입니다.' }, { status: 400 });
  }

  if (!body.itemId || !body.eventType || !body.sessionId) {
    return Response.json(
      { success: false, message: 'itemId, eventType, sessionId는 필수 항목입니다.' },
      { status: 400 },
    );
  }

  if (!['impression', 'click', 'swipe'].includes(body.eventType)) {
    return Response.json(
      { success: false, message: 'eventType은 impression | click | swipe 중 하나여야 합니다.' },
      { status: 400 },
    );
  }

  recordCarouselEvent({
    itemId: body.itemId,
    position: body.position ?? 0,
    eventType: body.eventType,
    stayDurationMs: body.stayDurationMs,
    sessionId: body.sessionId,
    timestamp: body.timestamp ?? new Date().toISOString(),
  });

  return Response.json({ success: true }, { status: 201 });
}

export async function GET(): Promise<Response> {
  const stats = getCarouselStats();
  return Response.json({ success: true, data: stats });
}
