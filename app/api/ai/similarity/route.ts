import { GoogleGenerativeAI, Part, EmbedContentRequest } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SimilarItemResult {
    id: string;
    userId: string;
    type: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    status: string;
    createdAt: Date;
    location: string | null;
    date: Date | null;
    score: number; // similarity score
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const EMBEDDING_MODEL = "text-embedding-004";
const TOP_K_COUNT = 5; 

/**
 * Handles the POST request to find similar items based on a photo.
 * @param req - The request object containing the item data and photo.
 */
export async function POST(req: Request) {
    try {
        const { photoBase64 } = await req.json();

        if (!photoBase64) {
            return new Response("Missing photoBase64 in request body.", { status: 400 });
        }

        // --- STEP 1: Generate Embedding Vector for the new photo ---
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
            const imageCaption = "test"; 

            // 1. Define the request object payload
            const requestPayload = {
                // The content property contains an array of Part objects (image + text)
                content: [
                    // Image Part
                    {
                        inlineData: { mimeType: "image/jpeg", data: photoBase64 } 
                    } as Part,
                    // Text Part
                    { 
                        text: imageCaption 
                    } as Part,
                ],
            };

        // 2. Call embedContent, casting the request payload to 'any'
        // This is necessary to bypass the compiler error caused by the SDK's type definition conflict.
        const response = await embeddingModel.embedContent(requestPayload as any);

        // ... (rest of the code continues below) ...
        const newEmbedding = response.embedding.values;
        
        // Convert the number array into the PostgreSQL vector string format
        const vectorString = `[${newEmbedding.join(",")}]`;

        // --- STEP 2: Perform Vector Search using Raw SQL ---
        // $queryRaw is used to execute native PostgreSQL queries, necessary for pgvector.
        const topMatches: SimilarItemResult[] = await prisma.$queryRaw`
            SELECT id, "userId", type, name, description, "imageUrl", status, 
                   "createdAt", location, date, 
                   -- Calculate Cosine Similarity: 1 - Cosine Distance (the <=> operator)
                   1 - (embedding <=> ${vectorString}::vector) as score 
            FROM item
            WHERE embedding IS NOT NULL
            ORDER BY score DESC -- Sort by similarity score (DESC = most similar first)
            LIMIT ${TOP_K_COUNT};
        `;

        // --- STEP 3: Return Results ---
        // Filter out matches that are not strong enough (e.g., score > 0.8)
        const strongMatches = topMatches.filter(match => match.score > 0.8);

        return NextResponse.json({ 
            matches: strongMatches, 
            message: "Similarity check complete." 
        }, { status: 200 });

    } catch (error) {
        console.error("AI Similarity Check Error:", error);
        // Ensure you handle the API key error here (Status 400 from Google API)
        return NextResponse.json(
            { error: "AI service failed. Please check your GOOGLE_API_KEY." },
            { status: 500 }
        );
    }
}