import type { CarouselTrackEvent, CarouselItemStats } from '@/types';

const events: CarouselTrackEvent[] = [];
const statsMap = new Map<number, Omit<CarouselItemStats, 'ctr' | 'avgStayMs'>>();

export function recordCarouselEvent(event: CarouselTrackEvent): void {
  events.push(event);

  if (!statsMap.has(event.itemId)) {
    statsMap.set(event.itemId, {
      itemId: event.itemId,
      impressions: 0,
      clicks: 0,
      swipes: 0,
      totalStayMs: 0,
    });
  }

  const stats = statsMap.get(event.itemId)!;

  if (event.eventType === 'impression') {
    stats.impressions++;
    if (event.stayDurationMs) stats.totalStayMs += event.stayDurationMs;
  } else if (event.eventType === 'click') {
    stats.clicks++;
  } else if (event.eventType === 'swipe') {
    stats.swipes++;
  }
}

export function getCarouselStats(): CarouselItemStats[] {
  return Array.from(statsMap.values()).map((s) => ({
    ...s,
    ctr: s.impressions > 0 ? Math.round((s.clicks / s.impressions) * 1000) / 10 : 0,
    avgStayMs: s.impressions > 0 ? Math.round(s.totalStayMs / s.impressions) : 0,
  }));
}

export function getRecentCarouselEvents(limit = 200): CarouselTrackEvent[] {
  return events.slice(-limit);
}
