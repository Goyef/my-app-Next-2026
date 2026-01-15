import Header from '@/components/header';
import Hero from '@/components/hero';
import Features from '@/components/features';
import Footer from '@/components/footer';
import { UserSubscriptions } from '@/components/user-subscriptions';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <UserSubscriptions />
      <Features />
      <Footer />
    </main>
  );
}
