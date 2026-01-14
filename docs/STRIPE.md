# 🔐 Documentation Stripe - Checkout Abonnement

## 📋 Prérequis

- Compte Stripe (mode test)
- Variables d'environnement configurées
- Next.js avec App Router

---

## 🔧 Variables d'environnement

Assure-toi d'avoir ces variables dans ton `.env.local` :

```env
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

> ⚠️ **Important** : En dev, utilise toujours les clés commençant par `sk_test_` et `pk_test_`

---

## 📦 Installation

```bash
npm install stripe @stripe/stripe-js
```

---

## 🏗️ Architecture

```
app/
├── api/
│   └── stripe/
│       ├── checkout/
│       │   └── route.ts          # Création session checkout
│       └── webhook/
│           └── route.ts          # Webhook Stripe
├── pricing/
│   └── page.tsx                  # Page des prix
└── success/
    └── page.tsx                  # Page de succès
```

---

## 1️⃣ Configuration Stripe (lib)

Crée `lib/stripe.ts` :

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia', // Utilise la dernière version stable
  typescript: true,
});
```

---

## 2️⃣ Créer un produit et prix dans Stripe Dashboard

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Assure-toi d'être en **mode Test** (toggle en haut à droite)
3. Va dans **Produits** → **Ajouter un produit**
4. Configure :
   - Nom : "Abonnement Premium"
   - Prix : 9.99€/mois (récurrent)
5. Copie le **Price ID** (commence par `price_xxx`)

---

## 3️⃣ Route API - Créer une session Checkout

Crée `app/api/stripe/checkout/route.ts` :

```typescript
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
```

---

## 4️⃣ Route API - Webhook

Crée `app/api/stripe/webhook/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      console.log('✅ Paiement réussi pour user:', userId);
      console.log('📦 Subscription ID:', subscriptionId);

      // TODO: Mettre à jour ton utilisateur dans la base de données
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: {
      //     stripeSubscriptionId: subscriptionId,
      //     subscriptionStatus: 'active',
      //   },
      // });

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('🔄 Subscription mise à jour:', subscription.id);
      console.log('Status:', subscription.status);

      // TODO: Mettre à jour le status de l'abonnement
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('❌ Subscription annulée:', subscription.id);

      // TODO: Désactiver l'abonnement de l'utilisateur
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('⚠️ Paiement échoué:', invoice.id);

      // TODO: Notifier l'utilisateur
      break;
    }

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

---

## 5️⃣ Composant Button Checkout (Client)

Crée `components/checkout-button.tsx` :

```typescript
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
```

---

## 6️⃣ Page Pricing

Crée `app/pricing/page.tsx` :

```typescript
import { CheckoutButton } from '@/components/checkout-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  // TODO: Récupérer le userId depuis la session
  const userId = 'user_123';

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Nos Offres</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Plan Gratuit */}
        <Card>
          <CardHeader>
            <CardTitle>Gratuit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">0€<span className="text-sm">/mois</span></p>
            <ul className="space-y-2 mb-6">
              <li>✅ Fonctionnalité 1</li>
              <li>✅ Fonctionnalité 2</li>
              <li>❌ Fonctionnalité Premium</li>
            </ul>
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">9.99€<span className="text-sm">/mois</span></p>
            <ul className="space-y-2 mb-6">
              <li>✅ Fonctionnalité 1</li>
              <li>✅ Fonctionnalité 2</li>
              <li>✅ Fonctionnalité Premium</li>
            </ul>
            <CheckoutButton
              priceId="price_xxx" // Remplace par ton Price ID
              userId={userId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 7️⃣ Page Success

Crée `app/success/page.tsx` :

```typescript
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
```

---

## 🧪 Tester en local avec Stripe CLI

### Installation Stripe CLI

```bash
# Windows (avec Scoop)
scoop install stripe

# Ou télécharge depuis https://stripe.com/docs/stripe-cli
```

### Connexion

```bash
stripe login
```

### Écouter les webhooks en local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

> 📝 Copie le `whsec_xxx` affiché et mets-le dans `STRIPE_WEBHOOK_SECRET`

### Déclencher un événement test

```bash
stripe trigger checkout.session.completed
```

---

## 💳 Cartes de test

| Numéro | Description |
|--------|-------------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 0002` | Carte refusée |
| `4000 0000 0000 3220` | Authentification 3D Secure |

**Date d'expiration** : N'importe quelle date future (ex: 12/34)
**CVC** : N'importe quels 3 chiffres (ex: 123)

---

## 📊 Schéma Prisma (optionnel)

Si tu veux stocker les infos d'abonnement :

```prisma
model User {
  id                   String   @id @default(cuid())
  email                String   @unique
  // ... autres champs

  // Stripe
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  subscriptionStatus   String?  @default("inactive") // active, canceled, past_due
  subscriptionEndDate  DateTime?
}
```

---

## 🔗 Ressources utiles

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Dashboard Test](https://dashboard.stripe.com/test/dashboard)

---

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Package `stripe` installé
- [ ] Produit créé dans Stripe Dashboard (mode test)
- [ ] Route checkout créée
- [ ] Route webhook créée
- [ ] Stripe CLI installé pour tester les webhooks
- [ ] Test avec carte `4242 4242 4242 4242`
