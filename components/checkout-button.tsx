'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

interface CheckoutButtonProps {
  priceId: string;
}

export function CheckoutButton({ priceId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.id }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url; // Redirection vers Stripe Checkout
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Chargement...' : user ? "S'abonner" : "Se connecter"}
    </Button>
  );
}