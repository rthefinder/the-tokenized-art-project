'use client';

import Link from 'next/link';
import { ConnectKitButton } from 'connectkit';
import { Palette } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Palette className="h-6 w-6" />
            <span className="text-xl font-bold">$ART</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/gallery" className="transition-colors hover:text-foreground/80">
              Gallery
            </Link>
            <Link href="/marketplace" className="transition-colors hover:text-foreground/80">
              Marketplace
            </Link>
            <Link href="/mint" className="transition-colors hover:text-foreground/80">
              Mint
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
          </nav>
        </div>
        <ConnectKitButton />
      </div>
    </header>
  );
}
