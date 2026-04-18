import { apiClient } from './api';
import type { Post } from '@/types';

export const postsService = {
  getAll(): Promise<Post[]> {
    return apiClient.get<Post[]>('/posts');
  },

  getById(id: number): Promise<Post> {
    return apiClient.get<Post>(`/posts/${id}`);
  },

  create(payload: Omit<Post, 'id'>): Promise<Post> {
    return apiClient.post<Post>('/posts', payload);
  },

  update(id: number, payload: Partial<Omit<Post, 'id'>>): Promise<Post> {
    return apiClient.patch<Post>(`/posts/${id}`, payload);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete<void>(`/posts/${id}`);
  },
};
