import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="mb-2 text-6xl font-bold text-gray-200">404</p>
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}
