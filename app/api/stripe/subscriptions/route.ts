import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non connecté' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!user.stripe_customer_id) {
      return NextResponse.json({
        success: true,
        subscriptions: [],
        message: 'Aucun compte Stripe associé',
      });
    }

    // Récupérer les abonnements depuis Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      limit: 50,
      expand: ['data.default_payment_method', 'data.items.data.price'],
    });

    // Formater les abonnements pour le frontend
    const formattedSubscriptions = await Promise.all(
      subscriptions.data.map(async (subscription) => {
        const item = subscription.items.data[0];
        const price = item?.price;
        
        // Récupérer le produit séparément pour éviter la limite d'expansion
        let productName = 'Abonnement';
        let productDescription: string | null = null;
        
        if (price?.product && typeof price.product === 'string') {
          try {
            const product = await stripe.products.retrieve(price.product);
            productName = product.name || 'Abonnement';
            productDescription = product.description || null;
          } catch {
            // Ignorer les erreurs de récupération du produit
          }
        }

        // Cast pour accéder aux propriétés de période
        const sub = subscription as any;
        
        return {
          id: subscription.id,
          status: subscription.status,
          current_period_start: sub.current_period_start ?? subscription.created,
          current_period_end: sub.current_period_end ?? null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at,
          created: subscription.created,
          plan: {
            id: price?.id,
            amount: (price?.unit_amount || 0) / 100,
            currency: price?.currency || 'eur',
            interval: price?.recurring?.interval || 'month',
            interval_count: price?.recurring?.interval_count || 1,
            product_name: productName,
            product_description: productDescription,
          },
          default_payment_method: subscription.default_payment_method
            ? {
                brand: (subscription.default_payment_method as any)?.card?.brand,
                last4: (subscription.default_payment_method as any)?.card?.last4,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions,
    });
  } catch (error) {
    console.error('Erreur récupération abonnements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des abonnements' },
      { status: 500 }
    );
  }
}

// Annuler un abonnement
export async function DELETE(request: NextRequest) {
  try {
    const { subscriptionId, userId, cancelImmediately = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non connecté' },
        { status: 401 }
      );
    }

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'ID d\'abonnement manquant' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user || !user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou pas de compte Stripe' },
        { status: 404 }
      );
    }

    // Vérifier que l'abonnement appartient bien à cet utilisateur
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.customer !== user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cet abonnement ne vous appartient pas' },
        { status: 403 }
      );
    }

    if (cancelImmediately) {
      // Annuler immédiatement
      await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Annuler à la fin de la période
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: cancelImmediately
        ? 'Abonnement annulé immédiatement'
        : 'Abonnement sera annulé à la fin de la période',
    });
  } catch (error) {
    console.error('Erreur annulation abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    );
  }
}

// Réactiver un abonnement annulé (si cancel_at_period_end était true)
export async function PATCH(request: NextRequest) {
  try {
    const { subscriptionId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non connecté' },
        { status: 401 }
      );
    }

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'ID d\'abonnement manquant' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user || !user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou pas de compte Stripe' },
        { status: 404 }
      );
    }

    // Vérifier que l'abonnement appartient bien à cet utilisateur
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.customer !== user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cet abonnement ne vous appartient pas' },
        { status: 403 }
      );
    }

    // Réactiver l'abonnement
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Abonnement réactivé avec succès',
    });
  } catch (error) {
    console.error('Erreur réactivation abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réactivation de l\'abonnement' },
      { status: 500 }
    );
  }
}
