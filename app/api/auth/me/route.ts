import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: true, user: null }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET 
    );

    const { payload } = await jwtVerify(token, secret);

    if (!payload.id_user) {
      return NextResponse.json({ error: true, user: null }, { status: 401 });
    }

    // Récupérer les infos complètes de l'utilisateur depuis la DB
    const user = await prisma.user.findUnique({
      where: { id_user: payload.id_user as string },
      select: {
        id_user: true,
        email: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: true, user: null }, { status: 401 });
    }

    return NextResponse.json({
      error: false,
      user: {
        id: user.id_user,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json({ error: true, user: null }, { status: 401 });
  }
}
