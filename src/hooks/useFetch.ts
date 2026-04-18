'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiError } from '@/types';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => void;
}

/**
 * Generic hook for data fetching with loading / error states.
 *
 * @example
 * const { data, isLoading, error, refetch } = useFetch(() => postsService.getAll());
 */
export function useFetch<T>(fetcher: () => Promise<T>): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  // Keep a stable reference to the fetcher so the effect doesn't re-run on every render
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcherRef
      .current()
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((err: unknown) => {
        const apiError: ApiError =
          err !== null && typeof err === 'object' && 'status' in err
            ? (err as ApiError)
            : { message: 'An unexpected error occurred', status: 500 };

        setState({ data: null, isLoading: false, error: apiError });
      });
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
