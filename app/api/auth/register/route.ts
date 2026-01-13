import { IRegister } from "@/app/interfaces/user";
import { MRegister } from "@/app/middleware/register";
import type { NextRequest } from "next/server";
import {prisma} from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";

export async function POST(req: NextRequest) {

    const {firstname, lastname, email, password, confirmPassword} : IRegister = await req.json()

    const middle = MRegister({firstname, lastname, email, password, confirmPassword})

    if (middle.length > 0) {
        return Response.json(middle)
    }

    try {
        const ps: string | undefined = await ArgonHash(password);

        if (ps === "false") {
            return Response.json({error: true, message: "error message", code: "E02"})
        }
         await prisma.user.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: ps as string,
        },
    });

    return Response.json({error: false, data: {
        firstname: firstname, 
        lastname: lastname, 
        email: email, 
        password: ps as string}})

        
    } catch (e) {
        console.log(e)
        return Response.json({error: true, message: "error", code: "E02"})
    }

}
