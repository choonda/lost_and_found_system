import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Item, Prisma } from "@prisma/client";

import { uploadFile } from "@/lib/actions/uploadUtils";
import { runAISimilarityCheck, saveItemWithEmbedding } from "@/lib/ai-features";
import { NextResponse } from "next/server";

const AI_MATCH_STATUS_CODE = 202; 

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();

  const photo = formData.get("photo");

    if (!(photo instanceof File)) {
         return new Response("Photo file is required.", { status: 400 });
    }

  let imageUrl = "";

  try {
    const uploadResult = await uploadFile(photo);
    imageUrl = uploadResult.fileUrl;
  } catch (err) {
    console.error("Failed to upload item photo:", err);
    return new Response("Failed to upload item photo", { status: 500 });
  }

// --- AI SIMILARITY CHECK INTEGRATION (FEATURE 1) ---
    try {
        const { description, similarItems } = await runAISimilarityCheck(photo);
        
        // Check if a strong match is found (e.g., similarity > 0.8)
        if (similarItems.length > 0 && similarItems[0].similarity > 0.8) {
            
            // Return 202 status code to tell the client to show the matches
            return NextResponse.json({ 
                message: "Potential matches found. Please review before posting.",
                aiDescription: description,
                similarItems: similarItems 
            }, { status: AI_MATCH_STATUS_CODE });
        }
    } catch (err) {
        // Log the AI error but DO NOT block the item creation flow
        console.warn("AI Similarity Check Failed (Continuing with post):", err);
    }
// ----------------------------------------------------

  const body: {
    type: "Lost" | "Found";
    name: string;
    location?: string;
    description?: string;
    date?: string;
    centerId?: string;
    imageUrl?: string;
  } = {
    type: formData.get("type") as "Lost" | "Found",
    name: formData.get("name") as string,
    location: formData.get("location") as string | undefined,
    description: formData.get("description") as string | undefined,
    date: formData.get("date") as string | undefined,
    centerId: formData.get("centerId") as string | undefined,
    imageUrl: imageUrl,
  };

  if (body.type !== "Lost" && body.type !== "Found") {
    return new Response("Invalid item type", { status: 400 });
  }

  const itemData: Prisma.ItemCreateInput = {
    user: {
      connect: { id: session.user.id },
    },
    type: body.type.toUpperCase() as "LOST" | "FOUND",
    name: body.name,
    description: body?.description ?? null,
    imageUrl: body.imageUrl ?? null,
    status: body.type === "Lost" ? "LOOKING" : "FOUND",
    location: body.location ?? null,
    date: body.date ? new Date(body.date) : null,
  };

let item: Item | null = null;
    let itemId: string;

    try {
        // Use the AI function to create the item AND the vector
        const result = await saveItemWithEmbedding(itemData, photo);
        itemId = result.id;
        
        // Retrieve the full item object created by the raw query
        item = await prisma.item.findUnique({ where: { id: itemId } });

    } catch (err) {
        console.error("Failed to create item with embedding:", err);
        return new Response("Failed to create item", { status: 500 });
    }

  if (!item) {
    return new Response("Failed to create item", { status: 500 });
  }

  if (body.type === "Found") {
    console.log("Processing found item with centerId:", body.centerId);

    if (!body.centerId) {
      return new Response("Center ID is required for found items", {
        status: 400,
      });
    }

    const center = await prisma.center.findUnique({
      where: { id: parseInt(body.centerId, 10) },
    });

    if (!center) {
      return new Response("Invalid Center ID", { status: 400 });
    }

    const foundItemData: Prisma.FoundItemCreateInput = {
      item: {
        connect: { id: item.id },
      },
      center: {
        connect: { id: parseInt(body.centerId, 10) },
      },
    };

    console.log("Found item data:", foundItemData);

    const foundItem = await prisma.foundItem.create({
      data: foundItemData,
    });

    return new Response(JSON.stringify({ item, foundItem }), { status: 200 });
  }

  return new Response(JSON.stringify(item), { status: 200 });
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  type type = "Lost" | "Found" | "All" | "Role";

  const url = new URL(req.url);
  const itemType: type = (url.searchParams.get("type") ?? "All") as type;
  // support time filtering from query (values like: '1 day', '1 week', '1 month', 'All')
  const timeQuery = (url.searchParams.get("time") ?? "All").toLowerCase();
  let dateGte: Date | undefined;
  if (timeQuery && timeQuery !== "all") {
    if (timeQuery.includes("day")) {
      dateGte = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    } else if (timeQuery.includes("week")) {
      dateGte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeQuery.includes("month")) {
      dateGte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  if (!["Lost", "Found", "All", "Role"].includes(itemType)) {
    return new Response("Invalid item type", { status: 400 });
  }

  let items = [];

  // Build where clause once so time filtering applies across types
  const where: any = {};
  if (itemType === "Role") {
    where.userId = session.user.id;
  } else if (itemType !== "All") {
    where.type = itemType.toUpperCase() as "LOST" | "FOUND";
  }
  if (dateGte) {
    // filter by the item's date (the event date), not the DB creation time
    // items which have no `date` will be excluded by this filter
    where.date = { gte: dateGte };
  }

  // sort: prefer item.date (event date) then fallback to createdAt
  items = await prisma.item.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
  

  return new Response(JSON.stringify(items), { status: 200 });
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const url = new URL(req.url);
    const itemId = url.searchParams.get("itemId");

    if (!itemId) {
      return new Response(JSON.stringify("No itemId provided"), {
        status: 200,
      });
    }
    const users = await prisma.item.delete({
      where: { id: itemId },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to delete item", { status: 500 });
  }
}