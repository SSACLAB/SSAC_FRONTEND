import { QUIZ_BANK } from '@/data/quiz-data';

interface SubmitBody {
  quizId: number;
  selectedIndex: number;
}

export async function POST(request: Request): Promise<Response> {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { quizId, selectedIndex } = body;
  if (typeof quizId !== 'number' || typeof selectedIndex !== 'number') {
    return Response.json({ error: 'quizId and selectedIndex are required' }, { status: 400 });
  }

  const quiz = QUIZ_BANK.find((q) => q.id === quizId);
  if (!quiz) {
    return Response.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const isCorrect = selectedIndex === quiz.correctIndex;

  return Response.json({
    isCorrect,
    correctIndex: quiz.correctIndex,
    explanation: quiz.explanation,
    score: isCorrect ? 10 : 0,
  });
}
