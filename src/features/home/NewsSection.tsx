import { homeService } from '@/services/home';
import type { NewsItem } from '@/types';
import { NewsSectionClient } from './NewsSectionClient';

export async function NewsSection() {
  let items: NewsItem[] = [];
  let initialError = false;

  try {
    items = await homeService.getNews('latest');
  } catch {
    initialError = true;
  }

  return <NewsSectionClient initialItems={items} initialError={initialError} />;
}
