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

✅ **Système d'authentification complet** (Registration, Login, OTP par Email)  
✅ **Gestion utilisateurs sécurisée** (Hachage Argon2i, validation d'email)  
✅ **Paiements Stripe** (Mode Sandbox, génération/annulation de factures)  
✅ **Landing page responsive** (Mobile & Desktop)  
✅ **UI moderne** avec shadcn/ui et thème clair/sombre  
✅ **Base de données PostgreSQL** via Neon  
✅ **ORM Prisma** pour la gestion des données  

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
| **Resend** | 6.7.0 | Service d'email transactionnel |
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
│   │   │   ├── login/            # POST: Connexion utilisateur
│   │   │   ├── register/         # POST: Création compte
│   │   │   ├── send-otp/         # POST: Envoi OTP par email
│   │   │   ├── verify-otp/       # POST: Vérification OTP
│   │   │   └── exemple/          # Exemples de routes
│   │   └── emails/               # Services d'email
│   │       ├── send/             # POST: Envoi email générique
│   │       └── send-otp/         # POST: Envoi email OTP
│   ├── page.tsx                  # Page d'accueil
│   ├── layout.tsx                # Layout global
│   ├── globals.css               # Styles globaux
│   ├── landing-page/             # Page de présentation
│   ├── login/                    # Page de connexion
│   ├── signup/                   # Page d'inscription
│   ├── otp/                      # Page vérification OTP
│   ├── pricing/                  # Page tarification
│   ├── middleware/               # Validation métier
│   │   ├── login.ts              # Validation login
│   │   └── register.ts           # Validation register
│   ├── interfaces/               # Interfaces TypeScript
│   │   ├── user.ts               # Interface User
│   │   └── exemple.ts            # Exemples d'interfaces
│   ├── services/                 # Services métier
│   │   └── resend.ts             # Configuration Resend
│   ├── hooks/                    # Custom Hooks
│   │   └── calc.tsx              # Hooks utilitaires
│   └── emails/                   # Templates email
│       └── otp.tsx               # Template OTP React
│
├── components/                   # Composants React
│   ├── ui/                       # Composants shadcn/ui
│   ├── auth-form.tsx             # Formulaires auth
│   ├── login-form.tsx            # Formulaire login
│   ├── signup-form.tsx           # Formulaire signup
│   ├── otp-form.tsx              # Formulaire OTP
│   ├── landing-page.tsx          # Composant landing
│   ├── hero.tsx                  # Section héro
│   ├── features.tsx              # Section features
│   ├── pricing.tsx               # Composant pricing
│   ├── footer.tsx                # Footer
│   ├── header.tsx                # Header
│   ├── theme-provider.tsx        # Provider thème
│   └── theme-toggler.tsx         # Toggle clair/sombre
│
├── lib/                          # Utilities et configurations
│   ├── prisma.ts                 # Client Prisma
│   ├── argon2i.ts                # Utilitaires hachage
│   ├── resend.ts                 # Configuration email
│   ├── utils.ts                  # Fonctions utilitaires
│   └── generated/                # Prisma generated files
│
├── hooks/                        # Custom Hooks globaux
│   └── use-mobile.ts             # Détection appareil mobile
│
├── prisma/                       # ORM Prisma
│   ├── schema.prisma             # Schéma base de données
│   └── migrations/               # Historique migrations
│
├── public/                       # Assets statiques
├── docs/                         # Documentation
│   ├── RESEND.md                 # Docs service email
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
- **Login** : Connexion avec email + mot de passe
- **Register** : Création de compte avec validation
- **OTP** : Vérification par one-time password via email
- **Validation** : Middleware de validation métier

#### 📧 Emails (`app/services/resend.ts`)
- Service d'envoi d'emails transactionnel
- Template React pour OTP
- Gestion des erreurs

#### 💾 Base de Données (`prisma/schema.prisma`)
```prisma
model User {
  id_user    String   @id @default(cuid())
  firstname  String
  lastname   String
  email      String   @unique
  password   String
  IsActive   Boolean  @default(false)
  otp        String?
  otpExpiry  DateTime?
}
```

---

## 📡 Documentation API

### 1. **POST** `/api/auth/register`

**Description** : Créer un nouveau compte utilisateur

**Headers**
```json
{
  "Content-Type": "application/json"
}
```

**Body**
```json
{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean@example.com",
  "password": "SecurePassword123!"
}
```

**Réponse Succès (200)**
```json
{
  "error": false,
  "message": "User created successfully",
  "data": {
    "id": "user_abc123",
    "email": "jean@example.com",
    "firstname": "Jean"
  }
}
```

**Réponse Erreur (400)**
```json
{
  "error": true,
  "message": "Email already exists",
  "code": "E03"
}
```

---

### 2. **POST** `/api/auth/login`

**Description** : Authentifier un utilisateur

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
  "message": "Login successful",
  "data": {
    "id": "user_abc123",
    "email": "jean@example.com",
    "firstname": "Jean"
  }
}
```

**Codes Erreur**
| Code | Message |
|---|---|
| E01 | Invalid email or password |
| E02 | Invalid email or password |
| E03 | User account inactive |

---

### 3. **POST** `/api/auth/send-otp`

**Description** : Envoyer un code OTP à un email

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
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

---


## 👥 Répartition du Travail

| Membre | Responsabilités |
|---|---|
| **Antoine DINH** | - Système d'authentification (Register)<br>- Gestion OTP (Send OTP, Verify OTP)<br>- Intégration Stripe (Paiements, Factures)<br>- API routes authentification<br>- Service emails (Resend) |
| **Maxime BORDESSOULLES** | - Architecture base de données Prisma<br>- Schéma User et migrations<br>- Forget Password (API & logique)<br>- Mise en place infrastructure Neon<br>- Gestion des merges Git<br>- Synchronisation équipe |
| **Mathis KASPERCZAK** | - Pages Frontend (Landing, Login, Signup, OTP, Pricing)<br>- Composants React réutilisables<br>- Dashboard utilisateur<br>- Design UI/UX avec shadcn/ui<br>- Thème clair/sombre (Next Themes)<br>- Responsive Design (Mobile & Desktop)<br>- Stylisation Tailwind CSS<br>- Contribution cross-feature UI |

**Architecture collaborative** : UI est un effort collectif avec contributions de chaque membre pour leurs modules respectifs.

---

### Vérification en Production
- ✅ Pages chargent correctement
- ✅ API répondent sans erreur
- ✅ Emails envoyés avec Resend
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
