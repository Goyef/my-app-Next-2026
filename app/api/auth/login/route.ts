import { ILogin } from "@/app/interfaces/user";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonVerify } from "@/lib/argon2i";
import { MLogin } from "@/app/middleware/login";
import { SignJWT } from "jose";
import { cookies } from "next/headers"; 

export async function POST(req: NextRequest) {
    const { email, password }: ILogin = await req.json()

    console.log("🔍 Login attempt for:", email)

    const middle = MLogin({ email, password })

    if (middle.length > 0) {
        console.log("❌ Validation errors:", middle)
        return NextResponse.json({ error: true, errors: middle }, { status: 400 })
    } 

    try {
        console.log("🔎 Recherche d'une adresse email valid:", email)
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })

        if (!user) {
            console.log("Utilisateur non trouvé")
            return NextResponse.json({ error: true, message: "Adresse email ou mot de passe incorrect", code: "E01" }, { status: 401 })
        } 

        console.log("Utilisateur trouvé:", user.email)

        if (!user.IsActive) {
            console.log("Le compte utilisateur n'est pas actif")
            return NextResponse.json({ error: true, message: "Le compte utilisateur n'est pas actif", code: "E03" }, { status: 403 })
        } 

        console.log("Vérification du mot de passe...")
        const isPasswordValid = await ArgonVerify(user.password, password)

        if (!isPasswordValid) {
            console.log("Verification du mot de passe échouée")
            return NextResponse.json({ error: true, message: "Adresse email ou mot de passe incorrect", code: "E02" }, { status: 401 })
        } 

        console.log("Mot de passe vérifié avec succès")
        console.log("Connexion réussie pour l'utilisateur:", user.email)

        // --- LOGIQUE JWT ---
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET 
        );

        const token = await new SignJWT({ 
            id_user: user.id_user, 
            email: user.email 
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15, // 15 minutes en secondes
        });

        return NextResponse.json({
            error: false,
            message: "Connexion réussie",
            data: {
                id: user.id_user,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            }
        }, { status: 200 }) 

    } catch (e) {
        console.error("Login error:", e)
        return NextResponse.json({ error: true, message: "An error occurred during login", code: "E99" }, { status: 500 })
    } 

}
