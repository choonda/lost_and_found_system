import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient, Item } from "@prisma/client";

// Define the interface for the raw SQL query result
// Prisma's $queryRaw returns 'unknown[]', so we tell TypeScript the expected shape.
// The raw query selects these fields, plus the calculated similarity score.
interface SimilarItemResult {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    similarity: number; // The cosine similarity score calculated by PostgreSQL
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const prisma = new PrismaClient();
const AI_EMBEDDING_DIMENSION = 768; // Dimension for text-embedding-004

/**
 * Utility to convert a Next.js File object (from FormData) into a raw Base64 string.
 * This is crucial for sending image data to the Gemini API.
 */
async function fileToBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
}

/**
 * Helper: Generates a concise text description from an image.
 */
async function describeImage(base64Image: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Describe this lost/found item in detail. Mention color, brand, distinct features, and type. Keep it under 50 words.";

    const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);

    return result.response.text();
}

/**
 * Helper: Converts text (description or search query) into an embedding vector.
 */
async function generateEmbedding(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

// --- FEATURE 1: CORE LOGIC ---

/**
 * Runs the AI similarity check for a newly uploaded photo against all existing items.
 * @param photo - The File object from FormData.
 * @returns An object containing the AI-generated description and similar items found.
 */
export async function runAISimilarityCheck(photo: File) {
    const base64Image = await fileToBase64(photo);

    // Step 1: Get description and embedding for the new item
    const description = await describeImage(base64Image);
    const vector = await generateEmbedding(description);

    // Step 2: Search database using cosine similarity (Prisma.$queryRaw)
    const vectorString = `[${vector.join(",")}]`;

    const rawItems = await prisma.$queryRaw`
        SELECT id, name, description, "imageUrl", 
        -- Calculate similarity (1 - distance)
        1 - (embedding <=> ${vectorString}::vector) as similarity
        FROM item
        WHERE embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT 5;
    `;

    // 🎯 FIX: Asserting the type to resolve the 'unknown' error
    const similarItems = rawItems as SimilarItemResult[];

    return { description, similarItems };
}

/**
 * Inserts a new item AND its corresponding embedding vector into the database.
 * This function replaces the standard prisma.item.create for new posts.
 */
export async function saveItemWithEmbedding(itemData: any, photo: File) {
    const base64Image = await fileToBase64(photo);

    // Use the same helper functions to generate data for saving
    const description = await describeImage(base64Image);
    const vector = await generateEmbedding(description);
    const vectorString = `[${vector.join(",")}]`;

    // The Item ID must be generated here since $executeRaw doesn't return the ID
    const newItemId = crypto.randomUUID();

    // We must use $executeRaw to insert the vector data correctly
    // Note: The date column is crucial for ordering/filtering, so it must be included in the raw insert.
    await prisma.$executeRaw`
        INSERT INTO "item" (id, "userId", type, name, description, "imageUrl", status, location, date, embedding, "createdAt", "updatedAt")
        VALUES (
        ${newItemId}, 
        ${itemData.userId}, 
        ${itemData.type}::"ItemType", 
        ${itemData.name}, 
        ${description}, 
        ${itemData.imageUrl}, 
        ${itemData.status}::"ItemStatus", 
        ${itemData.location}, 
        ${itemData.date}, 
        ${vectorString}::vector,
        NOW(),
        NOW()
        )
    `;


    // Return the ID for subsequent FoundItem/Claim logic
    return { id: newItemId, description };
}