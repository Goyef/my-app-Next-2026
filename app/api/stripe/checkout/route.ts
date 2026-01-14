import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Pour les abonnements
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Le Price ID de ton produit Stripe
          quantity: 1,
        },
      ],
      // URLs de redirection
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      // Métadonnées pour identifier l'utilisateur
      metadata: {
        userId: userId,
      },
      // Email pré-rempli (optionnel)
      // customer_email: userEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe checkout:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}