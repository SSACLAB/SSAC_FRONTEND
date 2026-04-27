import { env } from '@/lib/env';
import type { ApiError } from '@/types';

// ============================================================
// Core fetch wrapper
// ============================================================

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | boolean>;
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch('/api/v1/auth/reissue', { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  _retried = false,
): Promise<T> {
  const { body, params, headers, ...rest } = options;

  // Build query string
  const url = new URL(`${env.apiBaseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const isFormData = body instanceof FormData;

  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body !== undefined && {
      body: isFormData ? body : JSON.stringify(body),
    }),
  };

  const response = await fetch(url.toString(), fetchOptions);

  // Access Token 만료(401) → Refresh Token으로 재발급 후 재시도 (클라이언트 전용)
  if (response.status === 401 && !_retried && typeof window !== 'undefined') {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(endpoint, options, true);
    }
    // Refresh Token도 만료 → 로그인 페이지로 이동
    window.location.href = '/login?error=SESSION_EXPIRED';
    throw { message: '세션이 만료되었습니다. 다시 로그인해주세요.', status: 401 } as ApiError;
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Partial<ApiError>;
    const error: ApiError = {
      message: errorData.message ?? `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
      errors: errorData.errors,
    };
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ============================================================
// HTTP helpers
// ============================================================

type GetOptions = Pick<RequestOptions, 'params' | 'headers'>;
type MutationOptions = Pick<RequestOptions, 'headers'>;

export const apiClient = {
  get<T>(endpoint: string, options?: GetOptions): Promise<T> {
    return request<T>(endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, body?: Record<string, unknown>, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { method: 'POST', body, ...options });
  },

  put<T>(endpoint: string, body?: Record<string, unknown>, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { method: 'PUT', body, ...options });
  },

  patch<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: MutationOptions,
  ): Promise<T> {
    return request<T>(endpoint, { method: 'PATCH', body, ...options });
  },

  delete<T>(endpoint: string, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', ...options });
  },
};
