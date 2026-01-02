import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative">
      <div className="container flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Art Ownership.
            <br />
            <span className="text-primary">Verified On-Chain.</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            The Tokenized Art Project ($ART) brings transparency and authenticity to art ownership.
            For artists. For collectors. For culture.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/gallery">
              Explore Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/mint">Mint Your Art</Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-12 text-center">
          <div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">On-Chain</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5%</div>
            <div className="text-sm text-muted-foreground">Typical Royalties</div>
          </div>
          <div>
            <div className="text-3xl font-bold">∞</div>
            <div className="text-sm text-muted-foreground">Provenance</div>
          </div>
        </div>
      </div>
    </section>
  );
}
