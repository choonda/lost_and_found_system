import { prisma } from  "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {"Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch users", { status: 500});
    }
}

