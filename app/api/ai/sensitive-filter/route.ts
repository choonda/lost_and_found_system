import { filterSensitiveContent } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userQuery = body.userQuery;
        if (!userQuery) {
            return new Response(
                "Missing userQuery in request body.",
                { status: 400 }
            );
        }

        const isSensitive = await filterSensitiveContent(userQuery);
        return new Response(
            JSON.stringify({ isSensitive }), 
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        ); 

    } catch (err) {
        console.error("Failed to process sensitive content filter:", err);
        return new Response(
            "Internal Server Error during sensitive content filtering",
             { status: 500 }
        );
    }  
}