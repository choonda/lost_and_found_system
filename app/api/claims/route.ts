import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { userId, itemId, centerId } = body;

  if (!userId || !centerId || !itemId) {
    return new Response("Missing field required", { status: 400 });
  }
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) {
    return new Response("Item not found", { status: 400 });
  }
  if (item.status === "CLAIMED") {
    return new Response("Item already claimed", { status: 400 });
  }
  const claim = await prisma.claim.create({
    data: {
      item: { connect: { id: itemId } },
      user: { connect: { id: userId } },
      center: { connect: { id: centerId } },
    },
  });
  await prisma.item.update({
    where: { id: itemId },
    data: { status: "CLAIMED" },
  });

  return new Response(JSON.stringify(claim), { status: 200 });
}
