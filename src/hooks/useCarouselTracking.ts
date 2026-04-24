'use client';

import { useCallback, useEffect, useRef } from 'react';

interface TrackPayload {
  itemId: number;
  position: number;
  eventType: 'impression' | 'click' | 'swipe';
  stayDurationMs?: number;
}

function getOrCreateSessionId(): string {
  const key = 'carousel_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useCarouselTracking() {
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  const send = useCallback(async (payload: TrackPayload) => {
    if (!sessionIdRef.current) return;
    try {
      await fetch('/api/carousel/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          sessionId: sessionIdRef.current,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // 트래킹 실패는 UX에 영향 주지 않도록 silent fail
    }
  }, []);

  const trackImpression = useCallback(
    (itemId: number, position: number, stayDurationMs?: number) => {
      void send({ itemId, position, eventType: 'impression', stayDurationMs });
    },
    [send],
  );

  const trackClick = useCallback(
    (itemId: number, position: number) => {
      void send({ itemId, position, eventType: 'click' });
    },
    [send],
  );

  const trackSwipe = useCallback(
    (itemId: number, position: number) => {
      void send({ itemId, position, eventType: 'swipe' });
    },
    [send],
  );

  return { trackImpression, trackClick, trackSwipe };
}
