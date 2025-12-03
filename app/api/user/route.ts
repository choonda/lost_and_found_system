import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) return new Response("Unauthorized", { status: 401 });

    // Check user's role server-side
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch users", { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) return new Response("Unauthorized", { status: 401 });

    // Only ADMIN can delete users
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify("No UserId provided"), {
        status: 200,
      });
    }

    const users = await prisma.user.delete({
      where: { id: userId },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete user", { status: 500 });
  }
}
