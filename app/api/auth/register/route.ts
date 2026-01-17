import { IRegister } from "@/app/interfaces/user";
import { MRegister } from "@/app/middleware/register";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, password, confirmPassword }: IRegister = await req.json();

    // Validation via le middleware
    const middle = MRegister({ firstname, lastname, email, password, confirmPassword });

    if (middle.length > 0) {
      return NextResponse.json({ error: true, errors: middle }, { status: 400 });
    }

    // Vérification de l'existence de l'utilisateur
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: true, message: "L'Email est déjà utilisé" }, { status: 409 });
    }

    // Hachage du mot de passe
    const ps: string | undefined = await ArgonHash(password);

    if (ps === "false" || !ps) {
      return NextResponse.json({ error: true, message: "Password hashing failed", code: "E02" }, { status: 500 });
    }

    // Création de l'utilisateur en base de données
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: ps,
      },
    });

    return NextResponse.json(
      { 
        error: false, 
        data: { 
          id_user: user.id_user, 
          firstname: user.firstname, 
          lastname: user.lastname, 
          email: user.email 
        } 
      },
      { status: 201 }
    );

  } catch (e) {
    console.log("register error:", e);
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}