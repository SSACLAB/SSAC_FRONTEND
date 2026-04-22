import { apiClient } from './api';
import { getDailyQuiz } from '@/data/quiz-data';
import type { CarouselItem, ContentItem, NewsItem, Post, QuizItem } from '@/types';

// JSONPlaceholder photo shape (internal to this service)
interface JsonPlaceholderPhoto {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const homeService = {
  async getCarousel(): Promise<CarouselItem[]> {
    const photos = await apiClient.get<JsonPlaceholderPhoto[]>('/photos', {
      params: { albumId: 1, _limit: 5 },
    });
    return photos.map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.url,
    }));
  },

  async getQuiz(): Promise<QuizItem[]> {
    return getDailyQuiz();
  },

  async getContent(): Promise<ContentItem[]> {
    const posts = await apiClient.get<Post[]>('/posts', { params: { _start: 3, _limit: 6 } });
    return posts.map(
      (p): ContentItem => ({
        id: p.id,
        title: p.title,
        body: p.body,
      }),
    );
  },

  async getNews(): Promise<NewsItem[]> {
    const posts = await apiClient.get<Post[]>('/posts', { params: { _start: 9, _limit: 4 } });
    return posts.map(
      (p, i): NewsItem => ({
        id: p.id,
        title: p.title,
        summary: p.body.slice(0, 80).replace(/\n/g, ' '),
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      }),
    );
  },
};
