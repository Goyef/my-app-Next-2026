# 📧 Documentation Resend - Envoi d'emails

## 📋 Prérequis

- Compte Resend
- Clé API Resend
- Next.js avec App Router

---

## 🔧 Variables d'environnement

Ajoute ta clé API dans `.env.local` :

```env
RESEND_API_KEY=re_xxx
```

> ⚠️ **IMPORTANT** : Ne jamais hardcoder la clé API dans le code ! Utilise toujours les variables d'environnement.

---

## 📦 Installation

```bash
npm install resend
```

---

## 🏗️ Architecture

```
app/
├── api/
│   └── emails/
│       ├── send/
│       │   └── route.ts          # Envoi d'email simple
│       └── send-otp/
│           └── route.ts          # Envoi OTP
├── services/
│   └── resend.ts                 # Configuration Resend
└── emails/
    ├── welcome.tsx               # Template Welcome
    └── otp.tsx                   # Template OTP
```

---

## 1️⃣ Configuration Resend (lib)

Crée ou modifie `lib/resend.ts` :

```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
```

---

## 2️⃣ Envoi d'email simple

### Route API - `app/api/emails/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Mon App <noreply@mondomaine.com>', // Domaine vérifié ou onboarding@resend.dev
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
```

---

## 3️⃣ Templates React Email

### Installation React Email (optionnel mais recommandé)

```bash
npm install @react-email/components
```

### Template Welcome - `app/emails/welcome.tsx`

```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Section,
} from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur notre plateforme !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenue {username} ! 🎉</Heading>
          <Text style={text}>
            Nous sommes ravis de t'accueillir sur notre plateforme.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://monapp.com/dashboard">
              Accéder au Dashboard
            </Button>
          </Section>
          <Text style={footer}>
            À bientôt,<br />
            L'équipe Mon App
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '30px',
};
```

### Template OTP - `app/emails/otp.tsx`

```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface OTPEmailProps {
  otp: string;
  expiresIn?: number; // en minutes
}

export default function OTPEmail({ otp, expiresIn = 10 }: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ton code de vérification : {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Code de vérification</Heading>
          <Text style={text}>
            Utilise ce code pour te connecter :
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={warning}>
            ⏱️ Ce code expire dans {expiresIn} minutes.
          </Text>
          <Text style={footer}>
            Si tu n'as pas demandé ce code, ignore cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const codeContainer = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '20px 0',
  padding: '20px',
};

const code = {
  color: '#000',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  textAlign: 'center' as const,
  margin: '0',
};

const warning = {
  color: '#f59e0b',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px',
};
```

---

## 4️⃣ Utilisation avec React Email

### Route API avec template - `app/api/emails/send-welcome/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/app/emails/welcome';

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Mon App <noreply@mondomaine.com>',
      to: email,
      subject: 'Bienvenue sur Mon App ! 🎉',
      react: WelcomeEmail({ username }), // Utilise le composant React
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi' },
      { status: 500 }
    );
  }
}
```

### Route OTP - `app/api/emails/send-otp/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import OTPEmail from '@/app/emails/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Mon App <noreply@mondomaine.com>',
      to: email,
      subject: `Code de vérification : ${otp}`,
      react: OTPEmail({ otp, expiresIn: 10 }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi' },
      { status: 500 }
    );
  }
}
```

---

## 5️⃣ Service utilitaire

Crée `lib/email.ts` pour simplifier l'envoi :

```typescript
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/app/emails/welcome';
import OTPEmail from '@/app/emails/otp';

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export const emailService = {
  // Envoi email de bienvenue
  async sendWelcome(to: string, username: string) {
    return resend.emails.send({
      from: `Mon App <${FROM_EMAIL}>`,
      to,
      subject: 'Bienvenue sur Mon App ! 🎉',
      react: WelcomeEmail({ username }),
    });
  },

  // Envoi OTP
  async sendOTP(to: string, otp: string) {
    return resend.emails.send({
      from: `Mon App <${FROM_EMAIL}>`,
      to,
      subject: `Code de vérification : ${otp}`,
      react: OTPEmail({ otp }),
    });
  },

  // Envoi email custom
  async send(to: string, subject: string, html: string) {
    return resend.emails.send({
      from: `Mon App <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  },
};
```

### Utilisation

```typescript
import { emailService } from '@/lib/email';

// Envoyer un email de bienvenue
await emailService.sendWelcome('user@example.com', 'John');

// Envoyer un OTP
await emailService.sendOTP('user@example.com', '123456');
```

---

## 6️⃣ Prévisualisation des emails (Dev)

### Script package.json

```json
{
  "scripts": {
    "email:dev": "email dev --dir app/emails"
  }
}
```

### Lancer le serveur de prévisualisation

```bash
npm run email:dev
```

Ouvre http://localhost:3000 pour voir tes templates !

---

## 🔒 Configuration du domaine (Production)

### 1. Ajouter un domaine dans Resend

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Clique "Add Domain"
3. Entre ton domaine (ex: `monapp.com`)

### 2. Configurer les DNS

Ajoute ces enregistrements DNS :

| Type | Nom | Valeur |
|------|-----|--------|
| TXT | @ | `v=spf1 include:_spf.resend.com ~all` |
| CNAME | resend._domainkey | `[fourni par Resend]` |

### 3. Vérifier le domaine

Clique "Verify" dans Resend après avoir ajouté les DNS.

---

## 📊 Types et interfaces

```typescript
// types/email.ts
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  react?: React.ReactElement;
  text?: string;
  replyTo?: string;
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}
```

---

## 🧪 Mode développement

En dev, tu peux utiliser l'adresse par défaut :

```typescript
from: 'onboarding@resend.dev'
```

> ⚠️ Cette adresse ne fonctionne qu'en mode test et ne peut envoyer qu'à ton email vérifié.

---

## 🔗 Ressources utiles

- [Documentation Resend](https://resend.com/docs)
- [React Email](https://react.email)
- [Templates React Email](https://react.email/examples)
- [Dashboard Resend](https://resend.com/emails)

---

## ✅ Checklist

- [ ] Package `resend` installé
- [ ] Clé API dans les variables d'environnement
- [ ] Configuration `lib/resend.ts`
- [ ] (Optionnel) React Email pour les templates
- [ ] (Optionnel) Domaine vérifié pour la production
- [ ] Test d'envoi réussi
