import { sendEmail } from '@/lib/nodemailer';
import { getPasswordResetEmailHTML } from '@/lib/email-templates';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: true, message: "L'email est requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({
        error: false,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Envoyer l'email avec Nodemailer
    await sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: getPasswordResetEmailHTML(resetLink, 60),
    });

    console.log("[PASSWORD-FORGOT] Email envoyé avec succès:", {
      email,
      resetLink,
      timestamp: new Date().toISOString(),
    });

    return Response.json({
      error: false,
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });

  } catch (error) {
    console.error("[PASSWORD-FORGOT] Erreur inattendue:", {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      timestamp: new Date().toISOString(),
    });
    return Response.json(
      { error: true, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
