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
        invoices: [],
        message: 'Aucun compte Stripe associé',
      });
    }

    // Récupérer les factures depuis Stripe
    const invoices = await stripe.invoices.list({
      customer: user.stripe_customer_id,
      limit: 50,
    });

    // Formater les factures pour le frontend
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amount: invoice.amount_due / 100, // Convertir en euros/dollars
      currency: invoice.currency,
      created: invoice.created,
      due_date: invoice.due_date,
      paid_at: invoice.status_transitions?.paid_at,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      description: invoice.lines.data[0]?.description || 'Abonnement',
    }));

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
    });
  } catch (error) {
    console.error('Erreur récupération factures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

// Annuler une facture (void)
export async function DELETE(request: NextRequest) {
  try {
    const { invoiceId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non connecté' },
        { status: 401 }
      );
    }

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID de facture requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe et a un compte Stripe
    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user || !user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou pas de compte Stripe' },
        { status: 404 }
      );
    }

    // Récupérer la facture pour vérifier qu'elle appartient bien au client
    const invoice = await stripe.invoices.retrieve(invoiceId);

    if (invoice.customer !== user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cette facture ne vous appartient pas' },
        { status: 403 }
      );
    }

    // Vérifier le statut de la facture
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Impossible d\'annuler une facture déjà payée' },
        { status: 400 }
      );
    }

    if (invoice.status === 'void') {
      return NextResponse.json(
        { error: 'Cette facture est déjà annulée' },
        { status: 400 }
      );
    }

    // Annuler la facture (void)
    const voidedInvoice = await stripe.invoices.voidInvoice(invoiceId);

    return NextResponse.json({
      success: true,
      message: 'Facture annulée avec succès',
      invoice: {
        id: voidedInvoice.id,
        status: voidedInvoice.status,
      },
    });
  } catch (error) {
    console.error('Erreur annulation facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de la facture' },
      { status: 500 }
    );
  }
}
