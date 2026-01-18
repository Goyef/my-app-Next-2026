import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Récupérer les abonnements actifs de l'utilisateur
    const subscriptions = await prisma.subscription.findMany({
      where: {
        id_user: userId,
        end_date: {
          gte: new Date(), // Seulement les abonnements non expirés
        },
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
