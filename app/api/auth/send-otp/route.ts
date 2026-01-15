import { resend } from '@/lib/resend';
import { prisma } from '@/lib/prisma';
import OTPEmail from '@/components/emails/otp';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: true, message: "Email is required" }, { status: 400 });
    }

    // Générer un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expiration dans 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Sauvegarder l'OTP dans la base de données
    await prisma.user.update({
      where: { email },
      data: { 
        otp,
        otpExpiry,
      },
    });

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Domaine vérifié ou
      to: email,
      subject: `Code de vérification : ${otp}`,
      react: OTPEmail({ otp, expiresIn: 10 }),
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return Response.json({ error: true, message: "Failed to send OTP" }, { status: 500 });
    }

    return Response.json({
      error: false,
      message: "OTP sent to email",
      // otp: otp, // Décommenter pour tester en dev
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json(
      { error: true, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
