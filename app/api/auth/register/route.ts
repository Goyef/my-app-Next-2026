import { IRegister } from "@/app/interfaces/user";
import { MRegister } from "@/app/middleware/register";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";

export async function POST(req: NextRequest) {
  const { firstname, lastname, email, password, confirmPassword }: IRegister = await req.json();

  const middle = MRegister({ firstname, lastname, email, password, confirmPassword });

  if (middle.length > 0) {
    return NextResponse.json({ error: true, errors: middle }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: true, message: "L'Email est déjà utilisé" }, { status: 409 });
    }

    const ps: string | undefined = await ArgonHash(password);

    if (ps === "false" || !ps) {
      return NextResponse.json({ error: true, message: "Le hashage du mot de passe a échoué", code: "E02" }, { status: 500 });
    }

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: ps,
      },
    });

    return NextResponse.json(
      { error: false, data: { id_user: user.id_user, firstname: user.firstname, lastname: user.lastname, email: user.email } },
      { status: 201 }
    );
  } catch (e) {
    console.log("erreur d'enregistrement:", e);
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}

