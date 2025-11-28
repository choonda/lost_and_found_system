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

    // For file uploads the client now submits a FormData payload.
    const formData = await req.formData();

    const body = Object.fromEntries(Array.from(formData.entries()).filter(([k]) => k !== 'photo')) as Record<string, any>;

    if (!body.itemName || !body.description || !body.location || !body.date) {
        return new Response("Missing required fields", { status: 400 });
    }

    const photo = formData.get("photo");
    if (!photo) {
        return new Response("No photo provided", { status: 400 });
    }

    // `photo` should be a File from the client's FormData
    const fileUpload = await uploadFile(photo);

    if (!fileUpload || !fileUpload.fileUrl) {
        return new Response("File upload failed", { status: 500 });
    }

    const foundItem = await prisma.foundItem.create({
        data: {
            finderId: session.user.id,
            title: body.itemName,
            description: body.description,
            category: body.category || "Others",
            imageUrl: fileUpload.fileUrl,
            foundLocation: body.location,
            foundDate: new Date(body.date),
        },
    });

    return new Response(JSON.stringify(foundItem), { status: 200 });    
}

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const foundItems = await prisma.foundItem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                finder: true,
            },
        });

        return new Response(JSON.stringify(foundItems), {
            status: 200,
            headers: {"Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch found items", { status: 500});
    }
}
