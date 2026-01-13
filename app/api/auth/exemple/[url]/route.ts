import type { NextRequest } from "next/server";

import { IExemple } from "@/app/interfaces/exemple";

export async function GET(request: NextRequest, {params}: IExemple) {


    console.log((await params).url)

    return Response.json("Hello, World!");
}
