import { apiClient } from './api';
import { getDailyQuiz } from '@/data/quiz-data';
import { CAROUSEL_ITEMS } from '@/data/carousel-data';
import type { CarouselItem, ContentItem, NewsItem, NewsSortType, Post, QuizItem } from '@/types';

const NEWS_SOURCES = ['한국경제', '매일경제', '연합뉴스', '조선비즈', '머니투데이'];
const NEWS_CATEGORIES = ['주식', '환율', '부동산', '채권', '암호화폐', '금리', '펀드'];

export const homeService = {
  async getCarousel(): Promise<CarouselItem[]> {
    return CAROUSEL_ITEMS;
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

  async getNews(sort: NewsSortType = 'latest'): Promise<NewsItem[]> {
    const posts = await apiClient.get<Post[]>('/posts', { params: { _start: 9, _limit: 10 } });
    // 중요도 점수: 카테고리 기반으로 고정 시드값 부여 (1~10)
    const IMPORTANCE_BY_CATEGORY: Record<string, number> = {
      주식: 9,
      환율: 8,
      부동산: 7,
      채권: 6,
      암호화폐: 10,
      금리: 8,
      펀드: 5,
    };
    const items = posts.map((p, i): NewsItem => {
      // 앞 7개는 24시간 이내(최신), 나머지는 24시간 초과로 분산
      const hoursAgo = i < 7 ? i * 2 + 1 : 25 + i * 4;
      const sentences = p.body
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' ');
      const category = NEWS_CATEGORIES[i % NEWS_CATEGORIES.length]!;
      return {
        id: p.id,
        title: p.title,
        summary: sentences || p.body.slice(0, 120),
        source: NEWS_SOURCES[i % NEWS_SOURCES.length]!,
        category,
        publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        importance: IMPORTANCE_BY_CATEGORY[category] ?? 5,
      };
    });
    if (sort === 'importance') {
      return [...items].sort((a, b) => b.importance - a.importance);
    }
    return [...items].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  },
};
