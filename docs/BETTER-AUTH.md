# Better Auth - Documentation

Better Auth est une librairie d'authentification framework-agnostique et universelle pour TypeScript. Elle fournit un ensemble complet de fonctionnalités out-of-the-box et inclut un écosystème de plugins.

## Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Base de données](#base-de-données)
- [Méthodes d'authentification](#méthodes-dauthentification)
- [Configuration Next.js](#configuration-nextjs)
- [Client](#client)
- [Schéma de base de données](#schéma-de-base-de-données)
- [Plugins](#plugins)
- [Commandes CLI](#commandes-cli)

---

## Installation

### 1. Installer le package

```bash
npm install better-auth
# ou
pnpm add better-auth
# ou
yarn add better-auth
```

### 2. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Clé secrète (minimum 32 caractères)
# Générer avec: openssl rand -base64 32
BETTER_AUTH_SECRET=votre_cle_secrete_de_32_caracteres_minimum

# URL de base de l'application
BETTER_AUTH_URL=http://localhost:3000

# Base de données
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Configuration

### 3. Créer l'instance Better Auth

Créez un fichier `lib/auth.ts` :

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

---

## Base de données

### Avec Prisma (recommandé pour ce projet)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ou "mysql", "sqlite"
  }),
});
```

### Avec PostgreSQL directement

```typescript
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
});
```

### Avec SQLite

```typescript
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
});
```

---

## Méthodes d'authentification

### Email & Password

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
});
```

### Providers sociaux (OAuth)

```typescript
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
```

---

## Configuration Next.js

### 4. Créer le handler API

Créez le fichier `app/api/auth/[...all]/route.ts` :

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

---

## Client

### 5. Créer le client d'authentification

Créez le fichier `lib/auth-client.ts` :

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export des méthodes individuelles
export const { signIn, signUp, signOut, useSession } = authClient;
```

### Utilisation dans les composants

```tsx
"use client";

import { useSession, signIn, signOut, signUp } from "@/lib/auth-client";

export function AuthComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Chargement...</div>;

  if (session) {
    return (
      <div>
        <p>Connecté en tant que {session.user.email}</p>
        <button onClick={() => signOut()}>Se déconnecter</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn.email({ email: "test@example.com", password: "password" })}>
        Se connecter
      </button>
    </div>
  );
}
```

### Inscription

```typescript
await signUp.email({
  email: "user@example.com",
  password: "motdepasse123",
  name: "John Doe",
});
```

### Connexion

```typescript
await signIn.email({
  email: "user@example.com",
  password: "motdepasse123",
});
```

### Connexion OAuth

```typescript
await signIn.social({
  provider: "github",
  callbackURL: "/dashboard",
});
```

### Déconnexion

```typescript
await signOut();
```

---

## Schéma de base de données

Better Auth nécessite les tables suivantes :

### User

| Champ          | Type    | Description                          |
|----------------|---------|--------------------------------------|
| id             | string  | Identifiant unique (PK)              |
| name           | string  | Nom d'affichage                      |
| email          | string  | Email de l'utilisateur               |
| emailVerified  | boolean | Email vérifié                        |
| image          | string? | URL de l'image                       |
| createdAt      | Date    | Date de création                     |
| updatedAt      | Date    | Date de mise à jour                  |

### Session

| Champ      | Type    | Description                    |
|------------|---------|--------------------------------|
| id         | string  | Identifiant unique (PK)        |
| userId     | string  | ID de l'utilisateur (FK)       |
| token      | string  | Token de session unique        |
| expiresAt  | Date    | Date d'expiration              |
| ipAddress  | string? | Adresse IP                     |
| userAgent  | string? | User agent du navigateur       |
| createdAt  | Date    | Date de création               |
| updatedAt  | Date    | Date de mise à jour            |

### Account

| Champ                  | Type    | Description                    |
|------------------------|---------|--------------------------------|
| id                     | string  | Identifiant unique (PK)        |
| userId                 | string  | ID de l'utilisateur (FK)       |
| accountId              | string  | ID du compte provider          |
| providerId             | string  | ID du provider (github, etc.)  |
| accessToken            | string? | Token d'accès                  |
| refreshToken           | string? | Token de rafraîchissement      |
| accessTokenExpiresAt   | Date?   | Expiration access token        |
| refreshTokenExpiresAt  | Date?   | Expiration refresh token       |
| scope                  | string? | Scope                          |
| idToken                | string? | ID token                       |
| password               | string? | Mot de passe hashé             |
| createdAt              | Date    | Date de création               |
| updatedAt              | Date    | Date de mise à jour            |

### Verification

| Champ      | Type   | Description                    |
|------------|--------|--------------------------------|
| id         | string | Identifiant unique (PK)        |
| identifier | string | Identifiant de la demande      |
| value      | string | Valeur à vérifier              |
| expiresAt  | Date   | Date d'expiration              |
| createdAt  | Date   | Date de création               |
| updatedAt  | Date   | Date de mise à jour            |

### Schéma Prisma

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## Plugins

Better Auth propose de nombreux plugins :

| Plugin               | Description                                    |
|----------------------|------------------------------------------------|
| `twoFactor`          | Authentification à deux facteurs (2FA)         |
| `passkey`            | Connexion par passkey/WebAuthn                 |
| `magicLink`          | Connexion par lien magique                     |
| `username`           | Connexion par nom d'utilisateur                |
| `organization`       | Gestion des organisations                      |
| `admin`              | Panneau d'administration                       |
| `bearer`             | Authentification par token Bearer              |

### Exemple avec 2FA

```typescript
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "MonApp",
    }),
  ],
});
```

---

## Commandes CLI

### Générer le schéma

Génère le schéma pour votre ORM (Prisma, Drizzle) ou un fichier SQL :

```bash
npx @better-auth/cli generate
```

### Appliquer les migrations

Applique les migrations directement à la base de données :

```bash
npx @better-auth/cli migrate
```

### Vérifier le statut

Vérifie l'état des migrations :

```bash
npx @better-auth/cli status
```

---

## Personnalisation

### Champs additionnels sur User

```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false, // Non modifiable par l'utilisateur
      },
      firstname: {
        type: "string",
        required: true,
      },
      lastname: {
        type: "string",
        required: true,
      },
    },
  },
});
```

### Noms de tables personnalisés

```typescript
export const auth = betterAuth({
  user: {
    modelName: "users",
    fields: {
      name: "full_name",
      email: "email_address",
    },
  },
  session: {
    modelName: "user_sessions",
    fields: {
      userId: "user_id",
    },
  },
});
```

### Database Hooks

```typescript
export const auth = betterAuth({
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Logique avant création
          return { data: user };
        },
        after: async (user) => {
          // Logique après création (ex: créer client Stripe)
        },
      },
    },
  },
});
```

---

## Ressources

- **Documentation officielle** : https://www.better-auth.com/docs
- **GitHub** : https://github.com/better-auth/better-auth
- **LLMs.txt** : https://better-auth.com/llms.txt

---

## Migration depuis le système actuel

Pour migrer vers Better Auth depuis le système d'authentification actuel :

1. Installer Better Auth
2. Générer le schéma avec `npx @better-auth/cli generate`
3. Migrer les utilisateurs existants vers le nouveau schéma
4. Remplacer les routes `/api/auth/*` par le handler Better Auth
5. Mettre à jour les formulaires pour utiliser le client Better Auth

> **Note** : Better Auth utilise son propre système de hashage de mot de passe. Si vous migrez des utilisateurs existants, vous devrez soit rehacher les mots de passe, soit implémenter une logique de migration progressive.
