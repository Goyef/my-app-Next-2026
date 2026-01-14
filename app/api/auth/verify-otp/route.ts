import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return Response.json(
        { error: true, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec l'OTP
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id_user: true,
        otp: true,
        otpExpiry: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: true, message: "User not found" },
        { status: 404 }
      );
    }

    // Vérifier si l'OTP existe
    if (!user.otp || !user.otpExpiry) {
      return Response.json(
        { error: true, message: "No OTP requested" },
        { status: 400 }
      );
    }

    // Vérifier si l'OTP a expiré
    if (new Date() > user.otpExpiry) {
      // Nettoyer l'OTP expiré
      await prisma.user.update({
        where: { email },
        data: { otp: null, otpExpiry: null },
      });

      return Response.json(
        { error: true, message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Vérifier si l'OTP est correct
    if (user.otp !== otp) {
      return Response.json(
        { error: true, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP valide - nettoyer l'OTP de la base
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null },
    });

    // TODO: Créer une session ou un token JWT ici
    // Pour l'instant on retourne juste un succès

    return Response.json({
      error: false,
      message: "OTP verified successfully",
      userId: user.id_user,
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return Response.json(
      { error: true, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
