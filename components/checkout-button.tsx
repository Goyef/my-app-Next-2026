'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
}

export function CheckoutButton({ priceId, userId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
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
      {loading ? 'Chargement...' : "S'abonner"}
    </Button>
  );
}