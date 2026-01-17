# My App - Plateforme SaaS avec Authentification et Paiements

## 📋 Table des Matières

- [Présentation du Projet](#présentation-du-projet)
- [Stack Technique](#stack-technique)
- [Installation](#installation)
- [Lancement](#lancement)
- [Architecture du Projet](#architecture-du-projet)
- [Documentation API](#documentation-api)
- [Configuration Environnement](#configuration-environnement)
- [Répartition du Travail](#répartition-du-travail)
- [Déploiement](#déploiement)

---

## 🎯 Présentation du Projet

**My App** est une plateforme SaaS production-ready construite avec Next.js, intégrant :

✅ **Système d'authentification complet** (Registration, Login, OTP par Email, JWT)  
✅ **Gestion de session sécurisée** (JWT avec cookies httpOnly, Idle Timer)  
✅ **Gestion utilisateurs sécurisée** (Hachage Argon2i, validation d'email)  
✅ **Paiements Stripe** (Mode Sandbox, génération/annulation de factures)  
✅ **Landing page responsive** (Mobile & Desktop)  
✅ **UI moderne** avec shadcn/ui et thème clair/sombre  
✅ **Base de données PostgreSQL** via Neon  
✅ **ORM Prisma** pour la gestion des données  
✅ **Envoi d'emails** avec Nodemailer (SMTP)  

**Objectifs du projet** : Démontrer une architecture scalable, sécurisée et maintenable en production.

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **Next.js** | 16.1.1 | Framework fullstack React |
| **Prisma** | 7.2.0 | ORM et gestion de base de données |
| **Neon** | PostgreSQL | Base de données cloud |
| **shadcn/ui** | Latest | Composants UI accessibles |
| **Stripe** | Latest | Paiements en mode Sandbox |
| **Nodemailer** | Latest | Service d'email SMTP |
| **Jose** | Latest | Gestion des JWT |
| **Argon2i** | 0.44.0 | Hachage sécurisé des mots de passe |
| **Tailwind CSS** | Latest | Stylisation des composants |
| **Next Themes** | 0.4.6 | Gestion du thème clair/sombre |

---

## 📦 Installation

### Prérequis
- Node.js >= 18
- npm ou yarn
- Git

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Goyef/my-app-Next-2026.git
cd my-app-Next-2026
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Créer le fichier .env.local
cp .env.example .env.local
```

Voir [Configuration Environnement](#configuration-environnement) pour les détails.

4. **Initialiser la base de données**
```bash
npx prisma migrate dev --name init
```

5. **Générer le client Prisma**
```bash
npx prisma generate
```

---

## 🚀 Lancement

### Mode Développement
```bash
npm run dev
```
L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Mode Production
```bash
npm run build
npm start
```

### Voir les données de la base
```bash
npx prisma studio
```

---

## 📁 Architecture du Projet

```
my-app-Next-2026/
├── app/                          # App Router (Next.js)
│   ├── api/                      # Routes API
│   │   ├── auth/                 # Authentification
│   │   │   ├── login/            # POST: Connexion + génération JWT
│   │   │   ├── logout/           # POST: Déconnexion (suppression cookie)
│   │   │   ├── me/               # GET: Récupérer utilisateur courant via JWT
│   │   │   ├── register/         # POST: Création compte
│   │   │   ├── send-otp/         # POST: Envoi OTP par email
│   │   │   ├── verify-otp/       # POST: Vérification OTP
│   │   │   ├── password-forgot/  # POST: Demande reset password
│   │   │   └── password-reset/   # POST: Reset du mot de passe
│   │   ├── emails/               # Services d'email
│   │   │   └── send/             # POST: Envoi email générique
│   │   ├── stripe/               # Paiements Stripe
│   │   │   ├── checkout/         # POST: Création session paiement
│   │   │   ├── invoices/         # GET: Liste des factures
│   │   │   └── subscriptions/    # GET/DELETE/PATCH: Gestion abonnements
│   │   ├── subscription/         # Gestion abonnements utilisateur
│   │   └── dashboard/            # API Dashboard
│   │
│   ├── page.tsx                  # Page d'accueil (redirection)
│   ├── layout.tsx                # Layout global avec IdleTimer
│   ├── globals.css               # Styles globaux
│   ├── landing-page/             # Page de présentation
│   ├── login/                    # Page de connexion
│   ├── signup/                   # Page d'inscription
│   ├── otp/                      # Page vérification OTP
│   ├── pricing/                  # Page tarification
│   ├── factures/                 # Page des factures utilisateur
│   ├── success/                  # Page succès paiement
│   ├── forgotPassword/           # Page mot de passe oublié
│   ├── reset-password/           # Page réinitialisation mot de passe
│   ├── middleware/               # Validation métier
│   │   ├── login.ts              # Validation login
│   │   └── register.ts           # Validation register
│   ├── interfaces/               # Interfaces TypeScript
│   │   └── user.ts               # Interface User
│
├── components/                   # Composants React
│   ├── ui/                       # Composants shadcn/ui
│   ├── auth/                     # Composants authentification
│   │   └── idle-timer.tsx        # Timer d'inactivité (déconnexion auto)
│   ├── emails/                   # Templates email React
│   │   ├── otp.tsx               # Template OTP
│   │   └── forgetPassword.tsx    # Template reset password
│   ├── login-form.tsx            # Formulaire login
│   ├── signup-form.tsx           # Formulaire signup
│   ├── otp-form.tsx              # Formulaire OTP
│   ├── forgotPasswordForm.tsx    # Formulaire mot de passe oublié
│   ├── resetPasswordForm.tsx     # Formulaire reset password
│   ├── protected-route.tsx       # HOC route protégée
│   ├── header.tsx                # Header avec état utilisateur JWT
│   ├── hero.tsx                  # Section héro
│   ├── features.tsx              # Section features
│   ├── footer.tsx                # Footer
│   ├── landing-page.tsx          # Composant landing
│   ├── checkout-button.tsx       # Bouton paiement Stripe
│   ├── subscriptions-list.tsx    # Liste des abonnements
│   ├── user-subscriptions.tsx    # Abonnements utilisateur
│   ├── theme-provider.tsx        # Provider thème
│   └── theme-toggler.tsx         # Toggle clair/sombre
│
├── hooks/                        # Custom Hooks
│   ├── use-user.tsx              # Hook utilisateur (fetch JWT /api/auth/me)
│   ├── use-login.ts              # Hook logique login
│   └── use-signup.ts             # Hook logique signup
│
├── lib/                          # Utilities et configurations
│   ├── prisma.ts                 # Client Prisma
│   ├── argon2i.ts                # Utilitaires hachage
│   ├── stripe.ts                 # Configuration Stripe
│   ├── nodemailer.ts             # Configuration SMTP Nodemailer
│   ├── email-templates.ts        # Templates HTML emails
│   ├── utils.ts                  # Fonctions utilitaires
│   └── generated/                # Prisma generated files
│
├── prisma/                       # ORM Prisma
│   ├── schema.prisma             # Schéma base de données
│   └── migrations/               # Historique migrations
│
├── public/                       # Assets statiques
├── docs/                         # Documentation
│   └── STRIPE.md                 # Docs paiements
│
├── package.json                  # Dépendances
├── tsconfig.json                 # Config TypeScript
├── next.config.ts                # Config Next.js
├── tailwind.config.ts            # Config Tailwind
└── prisma.config.ts              # Config Prisma
```

### Modules Clés

#### 🔐 Authentification (`app/api/auth/`)
- **Login** : Connexion avec email + mot de passe, génération JWT
- **Logout** : Suppression du cookie JWT
- **Me** : Récupération utilisateur depuis le JWT
- **Register** : Création de compte avec validation
- **OTP** : Vérification par one-time password via email
- **Password Reset** : Réinitialisation mot de passe par email

#### 🔑 JWT & Session
- Token JWT stocké dans un cookie `httpOnly` sécurisé
- Expiration automatique après 15 minutes
- Idle Timer : Déconnexion automatique après 15 min d'inactivité
- Validation du token via `/api/auth/me`

#### 📧 Emails (`lib/nodemailer.ts`)
- Service d'envoi d'emails via SMTP (Gmail, Outlook, etc.)
- Templates HTML pour OTP et Reset Password
- Configuration via variables d'environnement

#### 💳 Stripe (`app/api/stripe/`)
- Création de sessions de paiement
- Gestion des abonnements (annulation, réactivation)
- Récupération des factures

#### 💾 Base de Données (`prisma/schema.prisma`)
```prisma
model User {
  id_user            String    @id @default(cuid())
  firstname          String
  lastname           String
  email              String    @unique
  password           String
  IsActive           Boolean   @default(false)
  otp                String?
  otpExpiry          DateTime?
  resetToken         String?
  resetTokenExpiry   DateTime?
  stripe_customer_id String?
}

model Subscription {
  id_subscription    String   @id @default(cuid())
  user_id            String
  plan               String
  start_date         DateTime
  end_date           DateTime
}
```

---

## 📡 Documentation API

### 1. **POST** `/api/auth/register`

**Description** : Créer un nouveau compte utilisateur

**Body**
```json
{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Réponse Succès (201)**
```json
{
  "error": false,
  "data": {
    "id_user": "user_abc123",
    "email": "jean@example.com",
    "firstname": "Jean",
    "lastname": "Dupont"
  }
}
```

---

### 2. **POST** `/api/auth/login`

**Description** : Authentifier un utilisateur et générer un JWT

**Body**
```json
{
  "email": "jean@example.com",
  "password": "SecurePassword123!"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "Connexion réussie",
  "data": {
    "id": "user_abc123",
    "email": "jean@example.com",
    "firstname": "Jean",
    "lastname": "Dupont"
  }
}
```

**Note** : Un cookie `auth_token` (httpOnly) est automatiquement défini.

---

### 3. **GET** `/api/auth/me`

**Description** : Récupérer l'utilisateur connecté via le JWT

**Réponse Succès (200)**
```json
{
  "error": false,
  "user": {
    "id": "user_abc123",
    "email": "jean@example.com",
    "firstname": "Jean",
    "lastname": "Dupont"
  }
}
```

---

### 4. **POST** `/api/auth/logout`

**Description** : Déconnecter l'utilisateur (suppression du cookie JWT)

**Réponse Succès (200)**
```json
{
  "success": true
}
```

---

### 5. **POST** `/api/auth/send-otp`

**Description** : Envoyer un code OTP par email

**Body**
```json
{
  "email": "jean@example.com"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "OTP sent to email"
}
```

---

### 6. **POST** `/api/auth/password-forgot`

**Description** : Demander un lien de réinitialisation de mot de passe

**Body**
```json
{
  "email": "jean@example.com"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "Email de réinitialisation envoyé"
}
```

---

### 7. **POST** `/api/auth/verify-otp`

**Description** : Vérifier le code OTP saisi par l'utilisateur

**Body**
```json
{
  "email": "jean@example.com",
  "otp": "123456"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "OTP verified successfully"
}
```

**Erreurs possibles** :
- `400` : OTP expiré ou invalide
- `404` : Utilisateur non trouvé

---

### 8. **POST** `/api/auth/password-reset`

**Description** : Réinitialiser le mot de passe avec un token valide

**Body**
```json
{
  "email": "jean@example.com",
  "token": "abc123...",
  "password": "NouveauMotDePasse123!"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

## 💳 API Stripe

### 9. **POST** `/api/stripe/checkout`

**Description** : Créer une session de paiement Stripe pour un abonnement

**Body**
```json
{
  "priceId": "price_1234567890",
  "userId": "user_abc123"
}
```

**Réponse Succès (200)**
```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**Note** : L'URL redirige vers la page de paiement Stripe. Après paiement, redirection vers `/success`.

---

### 10. **GET** `/api/stripe/subscriptions?userId={userId}`

**Description** : Récupérer la liste des abonnements d'un utilisateur

**Query Parameters**
| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `userId` | string | ✅ | ID de l'utilisateur |

**Réponse Succès (200)**
```json
{
  "success": true,
  "subscriptions": [
    {
      "id": "sub_1234567890",
      "status": "active",
      "current_period_start": 1737100000,
      "current_period_end": 1739778400,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "created": 1737100000,
      "plan": {
        "id": "price_123",
        "amount": 9.99,
        "currency": "eur",
        "interval": "month",
        "interval_count": 1,
        "product_name": "Plan Pro",
        "product_description": "Accès complet"
      },
      "default_payment_method": {
        "brand": "visa",
        "last4": "4242"
      }
    }
  ]
}
```

---

### 11. **DELETE** `/api/stripe/subscriptions`

**Description** : Annuler un abonnement

**Body**
```json
{
  "subscriptionId": "sub_1234567890",
  "userId": "user_abc123",
  "cancelImmediately": false
}
```

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `subscriptionId` | string | ✅ | ID de l'abonnement Stripe |
| `userId` | string | ✅ | ID de l'utilisateur |
| `cancelImmediately` | boolean | ❌ | `true` = annulation immédiate, `false` = fin de période (défaut) |

**Réponse Succès (200)**
```json
{
  "success": true,
  "message": "Abonnement sera annulé à la fin de la période"
}
```

---

### 12. **PATCH** `/api/stripe/subscriptions`

**Description** : Réactiver un abonnement annulé (si `cancel_at_period_end` était `true`)

**Body**
```json
{
  "subscriptionId": "sub_1234567890",
  "userId": "user_abc123"
}
```

**Réponse Succès (200)**
```json
{
  "success": true,
  "message": "Abonnement réactivé avec succès"
}
```

---

### 13. **GET** `/api/stripe/invoices?userId={userId}`

**Description** : Récupérer la liste des factures d'un utilisateur

**Query Parameters**
| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `userId` | string | ✅ | ID de l'utilisateur |

**Réponse Succès (200)**
```json
{
  "success": true,
  "invoices": [
    {
      "id": "in_1234567890",
      "number": "INV-0001",
      "status": "paid",
      "amount": 9.99,
      "currency": "eur",
      "created": 1737100000,
      "due_date": 1737704800,
      "paid_at": 1737100500,
      "invoice_pdf": "https://pay.stripe.com/invoice/...",
      "hosted_invoice_url": "https://invoice.stripe.com/...",
      "description": "Plan Pro - Janvier 2026"
    }
  ]
}
```

---

### 14. **DELETE** `/api/stripe/invoices`

**Description** : Annuler (void) une facture non payée

**Body**
```json
{
  "invoiceId": "in_1234567890",
  "userId": "user_abc123"
}
```

**Réponse Succès (200)**
```json
{
  "success": true,
  "message": "Facture annulée avec succès",
  "invoice": {
    "id": "in_1234567890",
    "status": "void"
  }
}
```

**Erreurs possibles** :
- `400` : Facture déjà payée ou déjà annulée
- `403` : La facture n'appartient pas à l'utilisateur

---

## 📧 API Emails

### 15. **POST** `/api/emails/send`

**Description** : Envoyer un email générique via SMTP

**Body**
```json
{
  "to": "destinataire@example.com",
  "subject": "Sujet de l'email",
  "html": "<h1>Contenu HTML</h1>"
}
```

**Réponse Succès (200)**
```json
{
  "success": true,
  "message": "Email envoyé avec succès"
}
```

---

## ⚙️ Configuration Environnement

Créer un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="votre_secret_jwt_tres_long_et_securise"

# Stripe
sk_test="sk_test_..."
NEXT_PUBLIC_APP_URL="https://votre-app.vercel.app"

# Nodemailer (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre.email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
SMTP_FROM="votre.email@gmail.com"
```

### Configuration Gmail
Pour utiliser Gmail avec Nodemailer :
1. Activer la vérification en 2 étapes sur votre compte Google
2. Créer un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `SMTP_PASSWORD`

---

## 👥 Répartition du Travail

| Membre | Responsabilités |
|---|---|
| **Antoine DINH** | - Système d'authentification (Register, Login)<br>- Gestion OTP (Send OTP, Verify OTP)<br>- Intégration Stripe (Paiements, Factures, Abonnements)<br>- API routes authentification<br>- **Service emails Nodemailer** (templates, envoi SMTP)|
| **Maxime BORDESSOULLES** | - Architecture base de données Prisma<br>- Schéma User et migrations<br>- Forget Password (API & logique)<br>- **Système JWT** (génération, validation, cookies httpOnly)<br>- Route `/api/auth/me` et `/api/auth/logout`<br>- Mise en place infrastructure Neon<br>- Gestion des merges Git<br>- Synchronisation équipe<br>- Idle Timer (déconnexion automatique)  |
| **Mathis KASPERCZAK** | - Pages Frontend (Landing, Login, Signup, OTP, Pricing, Factures)<br>- Composants React réutilisables<br>- Dashboard utilisateur<br>- Design UI/UX avec shadcn/ui<br>- Thème clair/sombre (Next Themes)<br>- Responsive Design (Mobile & Desktop)<br>- Stylisation Tailwind CSS<br>- Hook `useUser` pour état utilisateur |

---

## 🚀 Déploiement

### Déploiement sur Vercel

1. **Connecter le repository GitHub à Vercel**

2. **Configurer les variables d'environnement** dans Vercel Dashboard > Settings > Environment Variables :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | Votre URL PostgreSQL Neon |
| `JWT_SECRET` | Un secret sécurisé |
| `sk_test` | Clé secrète Stripe |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | Votre email |
| `SMTP_PASSWORD` | Mot de passe d'application |
| `SMTP_FROM` | Votre email |

3. **Déployer**

### Vérification en Production
- ✅ Pages chargent correctement
- ✅ API répondent sans erreur
- ✅ Emails envoyés avec Nodemailer
- ✅ JWT fonctionnel (login/logout)
- ✅ Paiements Stripe fonctionnels
- ✅ Base de données synchronisée

---

## 📞 Support

Pour des questions ou problèmes :
1. Consulter la [documentation API](#documentation-api)
2. Vérifier les logs (`npm run dev`)
3. Valider les variables d'environnement
4. Vérifier les migrations Prisma (`npx prisma migrate status`)

---

**Status** : ✅ Production-Ready
