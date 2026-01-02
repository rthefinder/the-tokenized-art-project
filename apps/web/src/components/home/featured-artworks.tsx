'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function FeaturedArtworks() {
  // This would fetch from the blockchain/indexer in production
  const featured = [
    {
      id: '1',
      title: 'Digital Dreams',
      artist: '0x1234...5678',
      image: '/placeholder.jpg',
      price: '1.5 ETH',
    },
    {
      id: '2',
      title: 'Abstract Reality',
      artist: '0x8765...4321',
      image: '/placeholder.jpg',
      price: '2.0 ETH',
    },
    {
      id: '3',
      title: 'Neon Genesis',
      artist: '0x9876...1234',
      image: '/placeholder.jpg',
      price: '0.8 ETH',
    },
  ];

  return (
    <section className="border-t bg-muted/40 py-16">
      <div className="container">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Artworks</h2>
          <p className="text-muted-foreground">
            Discover unique pieces from talented artists around the world
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((artwork) => (
            <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <h3 className="font-semibold">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                  <p className="mt-2 font-medium">{artwork.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
