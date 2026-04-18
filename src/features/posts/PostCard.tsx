import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { truncate } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <span className="mb-1 text-xs font-medium text-blue-600">POST #{post.id}</span>
        <h3 className="text-base font-semibold capitalize text-gray-900">{post.title}</h3>
      </CardHeader>
      <CardBody>
        <p className="text-sm leading-relaxed text-gray-600">{truncate(post.body, 120)}</p>
      </CardBody>
    </Card>
  );
}
