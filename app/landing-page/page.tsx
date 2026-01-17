import Header from '@/components/header';
import Hero from '@/components/hero';
import Features from '@/components/features';
import Footer from '@/components/footer';
import { SubscriptionsList } from '@/components/subscriptions-list';
import { Crown } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            Mes Abonnements
          </h1>
          <p className="text-muted-foreground mt-2">
            Consultez et gérez vos abonnements Stripe
          </p>
        </div>
        <SubscriptionsList />
      </section>
      <Features />
      <Footer />
    </main>
  );
}
