import { homeService } from '@/services/home';
import { QuizCard } from './QuizCard';

export async function QuizSection() {
  const items = await homeService.getQuiz();

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">오늘의 퀴즈</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <QuizCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
