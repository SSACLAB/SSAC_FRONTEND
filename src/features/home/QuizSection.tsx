import { homeService } from '@/services/home';
import { QuizWidget } from './QuizWidget';

export async function QuizSection() {
  const items = await homeService.getQuiz();

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">오늘의 금융 퀴즈</h2>
          <p className="mt-1 text-sm text-gray-500">매일 새로운 퀴즈로 금융 감각을 키워보세요</p>
        </div>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          3문제
        </span>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <QuizWidget pool={items} />
      </div>
    </section>
  );
}
