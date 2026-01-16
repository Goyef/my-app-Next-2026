import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Fonction pour créer ou récupérer un customer Stripe
async function getOrCreateStripeCustomer(userId: string) {
  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Si l'utilisateur a déjà un customer Stripe, le retourner
  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  // Sinon, créer un nouveau customer Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstname} ${user.lastname}`,
    metadata: {
      userId: userId,
    },
  });

  // Sauvegarder le customer_id dans la base de données
  await prisma.user.update({
    where: { id_user: userId },
    data: { stripe_customer_id: customer.id },
  });

  return customer.id;
}

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non connecté' },
        { status: 401 }
      );
    }

    // Créer ou récupérer le customer Stripe
    const customerId = await getOrCreateStripeCustomer(userId);

    // Créer la session de checkout avec le customer
    const session = await stripe.checkout.sessions.create({
      customer: customerId, // Associer au customer pour les factures
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // URLs de redirection
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      // Métadonnées pour identifier l'utilisateur
      metadata: {
        userId: userId,
      },
      // Options de facturation
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
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