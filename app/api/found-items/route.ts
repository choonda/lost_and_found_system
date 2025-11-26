import { prisma } from  "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const foundItem = await prisma.foundItem.create({
        data: {
            finderId: session.user.id,
            title: body.itemName,
            description: body.description,
            category: body.category || "Others",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
            foundLocation: body.location,
            foundDate: new Date(body.date),
        },
    });

    return new Response(JSON.stringify(foundItem), { status: 200 });    
}

