import { prisma } from  "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadFile } from "@/lib/actions/uploadUtils";


export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Accept FormData from the client so files preserve name/size
    const formData = await req.formData();
    const body = Object.fromEntries(Array.from(formData.entries()).filter(([k]) => k !== 'photo')) as Record<string, any>;

    // Upload photo if present
    const photo = formData.get("photo");

    let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png";
    if (photo) {
        try {
            const uploadResult = await uploadFile(photo);
            imageUrl = uploadResult.fileUrl;
        } catch (err) {
            console.error("Failed to upload lost item photo:", err);
            // keep default placeholder if upload fails
        }
    }

    const lostItem = await prisma.lostItem.create({
        data: {
            userId: session.user.id,
            title: body.itemName,
            description: body.description,
            category: body.category || "Others",
            imageUrl,
            lostLocation: body.location,
            lostDate: new Date(body.date),
        },
    });

    return new Response(JSON.stringify(lostItem), { status: 200 });    
}

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const lostItems = await prisma.lostItem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
            },
        });
        return new Response(JSON.stringify(lostItems), {
            status: 200,
            headers: {"Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch lost items", { status: 500});
    }
}

