import { prisma } from '@/lib/prisma';
import { ArgonHash } from '@/lib/argon2i';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return Response.json(
        { error: true, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return Response.json(
        { error: true, message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe et si le token est valide
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: true, message: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier le token
    if (!user.resetToken || user.resetToken !== token) {
      return Response.json(
        { error: true, message: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return Response.json(
        { error: true, message: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await ArgonHash(password);

    if (hashedPassword === "false") {
      return Response.json(
        { error: true, message: "Erreur lors du hashage du mot de passe" },
        { status: 500 }
      );
    }

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log("[PASSWORD-RESET] Mot de passe réinitialisé avec succès:", {
      email,
      timestamp: new Date().toISOString(),
    });

    return Response.json({
      error: false,
      message: "Mot de passe réinitialisé avec succès",
    });

  } catch (error) {
    console.error("[PASSWORD-RESET] Erreur inattendue:", {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      timestamp: new Date().toISOString(),
    });
    return Response.json(
      { error: true, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
