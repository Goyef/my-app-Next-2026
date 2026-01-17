import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Mapping entre les priceId Stripe et les noms de plans
const PRICE_ID_TO_PLAN: Record<string, string> = {
  'price_1SpS5LFXIS2IIz5emWEx1QxS': 'Basic',
  'price_1SpS6KFXIS2IIz5e3wmLjhWp': 'Premium',
};

// Fonction pour calculer la date de fin d'abonnement (30 jours par défaut)
function calculateEndDate(days: number = 30): Date {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  return endDate;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Missing sessionId or userId' },
        { status: 400 }
      );
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Vérifier que la session a été payée
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Récupérer l'ID du prix
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const firstLineItem = lineItems.data[0];

    if (!firstLineItem || !firstLineItem.price) {
      return NextResponse.json(
        { error: 'No price found in session' },
        { status: 400 }
      );
    }

    const priceId = firstLineItem.price.id;
    const planName = PRICE_ID_TO_PLAN[priceId] || 'Unknown';

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a déjà une subscription pour cette session
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripe_session_id: sessionId },
    });

    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        message: 'Subscription already created',
        subscription: existingSubscription,
      });
    }

    // Créer la subscription
    const subscription = await prisma.subscription.create({
      data: {
        id_user: userId,
        plan: planName,
        stripe_session_id: sessionId,
        stripe_price_id: priceId,
        end_date: calculateEndDate(30), // 30 jours d'abonnement
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    );
  }
}
