'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const userId = searchParams.get('userId'); // Assurez-vous de passer userId en paramètre
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!sessionId || !userId) {
        setError('Session ou utilisateur manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/subscription/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, userId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Erreur lors de la création de l\'abonnement');
        } else {
          setSuccess(true);
        }
      } catch (err) {
        setError('Erreur réseau lors de la confirmation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    confirmSubscription();
  }, [sessionId, userId]);

  return (
    <div className="container mx-auto py-20 text-center">
      {loading && (
        <>
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            ⏳ Traitement en cours...
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Nous finalisons votre abonnement. Veuillez patienter...
          </p>
        </>
      )}

      {error && !loading && (
        <>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            ❌ Erreur
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {error}
          </p>
          <Button asChild>
            <Link href="/pricing">Retour aux plans</Link>
          </Button>
        </>
      )}

      {success && !loading && (
        <>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            🎉 Paiement réussi !
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Merci pour ton abonnement. Tu as maintenant accès à toutes les fonctionnalités premium.
          </p>
          <Button asChild>
            <Link href="/landing-page">Aller au Dashboard</Link>
          </Button>
        </>
      )}
    </div>
  );
}