import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadFile } from "@/lib/actions/uploadUtils";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true },
  });

  if (!user) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const photo = formData.get("photo");
  const name = (formData.get("name") as string) ?? undefined;
  // Only allow update of image and name for now
  try {
    let imageUrl: string | undefined;

    if (photo && (photo as any).size) {
      const uploadResult = await uploadFile(photo);
      imageUrl = uploadResult.fileUrl;
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(name ? { name } : {}),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to update profile:", err);
    return new Response("Failed to update profile", { status: 500 });
  }
}
