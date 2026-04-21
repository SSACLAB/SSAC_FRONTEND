import { homeService } from '@/services/home';
import { CarouselDisplay } from './CarouselDisplay';

export async function CarouselSection() {
  const items = await homeService.getCarousel();

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">주요 콘텐츠</h2>
      <CarouselDisplay items={items} />
    </section>
  );
}
