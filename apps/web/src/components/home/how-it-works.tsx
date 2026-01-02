import { Palette, Shield, Coins, History } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Palette,
      title: 'Create',
      description: 'Artists mint their artwork as NFTs with complete control over royalties and metadata.',
    },
    {
      icon: Shield,
      title: 'Verify',
      description: 'Every artwork is verified on-chain with immutable provenance and authenticity.',
    },
    {
      icon: Coins,
      title: 'Trade',
      description: 'Collectors buy and sell artwork directly, with automatic royalty payments to artists.',
    },
    {
      icon: History,
      title: 'Preserve',
      description: 'Artwork and metadata are stored on IPFS/Arweave for long-term preservation.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A transparent, artist-first platform built on Ethereum
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
