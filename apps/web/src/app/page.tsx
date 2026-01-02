import { Hero } from '@/components/home/hero';
import { FeaturedArtworks } from '@/components/home/featured-artworks';
import { HowItWorks } from '@/components/home/how-it-works';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedArtworks />
      <HowItWorks />
    </div>
  );
}
