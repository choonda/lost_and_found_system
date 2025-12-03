import { findSimilarItemsByImage } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const Base64 = await req.json();

    if (!Base64) {
      return new Response("Missing photoBase64 in request body.", {
        status: 400,
      });
    }

    const similarData = await findSimilarItemsByImage(Base64);
    return new Response(
      JSON.stringify({
        similarItems: similarData.similarItems,
        aiDescription: similarData.description,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Failed to process image or find similar items:", err);
    const message =
      err?.message ||
      String(err) ||
      "Internal Server Error during image processing";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
