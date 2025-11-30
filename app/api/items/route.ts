import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Item, Prisma } from "@prisma/client";

import { uploadFile } from "@/lib/actions/uploadUtils";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();

  const photo = formData.get("photo");

  let imageUrl = "";

  try {
    const uploadResult = await uploadFile(photo);
    imageUrl = uploadResult.fileUrl;
  } catch (err) {
    console.error("Failed to upload item photo:", err);
    return new Response("Failed to upload item photo", { status: 500 });
  }

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

  const item = await prisma.item.create({
    data: itemData,
  });

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

    if (
      prisma.center.findUnique({
        where: { id: parseInt(body.centerId, 10) },
      }) === null
    ) {
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

  if (!["Lost", "Found", "All", "Role"].includes(itemType)) {
    return new Response("Invalid item type", { status: 400 });
  }

  let items = [];

  if (itemType === "All") {
    items = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (itemType === "Role") {
    items = await prisma.item.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    items = await prisma.item.findMany({
      where: {
        type: itemType.toUpperCase() as "LOST" | "FOUND",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return new Response(JSON.stringify(items), { status: 200 });
}
