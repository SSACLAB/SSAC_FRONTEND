'use client';

import { useFetch } from '@/hooks/useFetch';
import { postsService } from '@/services/posts';
import { Button } from '@/components/ui/Button';
import { PostCard } from './PostCard';

export function PostList() {
  const { data: posts, isLoading, error, refetch } = useFetch(() => postsService.getAll());

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-4 text-sm text-red-600">{error.message}</p>
        <Button variant="danger" size="sm" onClick={refetch}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <p className="text-center text-gray-500">포스트가 없습니다.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">총 {posts.length}개의 포스트</p>
        <Button variant="secondary" size="sm" onClick={refetch}>
          새로고침
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
