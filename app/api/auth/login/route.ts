import { ILogin } from "@/app/interfaces/user";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonVerify } from "@/lib/argon2i";
import { MLogin } from "@/app/middleware/login";

export async function POST(req: NextRequest) {
    const { email, password }: ILogin = await req.json()

    console.log("🔍 Login attempt for:", email)

    const middle = MLogin({ email, password })

    if (middle.length > 0) {
        console.log("❌ Validation errors:", middle)
        return Response.json(middle)
    }

    try {
        console.log("🔎 Looking for user with email:", email)
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })

        if (!user) {
            console.log("User not found")
            return Response.json({ error: true, message: "Invalid email or password", code: "E01" })
        }

        console.log("User found:", user.email)

        console.log("Verifying password...")
        const isPasswordValid = await ArgonVerify(user.password, password)

        if (!isPasswordValid) {
            console.log("Password verification failed")
            return Response.json({ error: true, message: "Invalid email or password", code: "E02" })
        }

        console.log("Password verified successfully")
        console.log(" Login successful for user:", user.email)

        return Response.json({
            error: false,
            message: "Login successful",
            data: {
                id: user.id_user,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            }
        })

    } catch (e) {
        console.error("Login error:", e)
        return Response.json({ error: true, message: "An error occurred during login", code: "E02" })
    }

}
