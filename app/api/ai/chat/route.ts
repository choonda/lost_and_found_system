import { prisma } from "@/lib/prisma";
import { chatWithAI } from "@/lib/gemini";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return new Response("Unauthorized", { status: 401 });

  const { message } = await req.json();

  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  const response = await chatWithAI(message);

  return new Response(JSON.stringify({ reply: response }), { status: 200 });
}
