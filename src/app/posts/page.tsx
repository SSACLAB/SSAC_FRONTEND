import type { Metadata } from 'next';
import { PostList } from '@/features/posts/PostList';

export const metadata: Metadata = {
  title: '포스트',
  description: 'JSONPlaceholder API를 활용한 포스트 목록 예제',
};

export default function PostsPage() {
  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">포스트</h1>
        <p className="mt-2 text-gray-600">
          JSONPlaceholder API에서 불러온 실시간 데이터 예제입니다.
        </p>
      </div>

      <PostList />
    </div>
  );
}
