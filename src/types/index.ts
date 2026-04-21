// ============================================================
// Common API Types
// ============================================================

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ============================================================
// Example Domain Types (JSONPlaceholder)
// ============================================================

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// ============================================================
// Home Domain Types
// ============================================================

export interface CarouselItem {
  id: number;
  title: string;
  imageUrl: string;
}

export interface QuizItem {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface ContentItem {
  id: number;
  title: string;
  body: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface HomeData {
  carousel: CarouselItem[];
  quiz: QuizItem[];
  content: ContentItem[];
  news: NewsItem[];
}

// ============================================================
// UI / Component Types
// ============================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
