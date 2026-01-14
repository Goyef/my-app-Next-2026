import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        🎉 Paiement réussi !
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Merci pour ton abonnement. Tu as maintenant accès à toutes les fonctionnalités premium.
      </p>
      <Button asChild>
        <Link href="/dashboard">Aller au Dashboard</Link>
      </Button>
    </div>
  );
}