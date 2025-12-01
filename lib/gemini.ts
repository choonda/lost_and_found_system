// lib/ai-helper.ts
import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";

// Initialize Gemini
const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});
const prisma = new PrismaClient();

/**
 * 1. HELPER: Generates a text description from an image 
 * We use this to normalize everything to text for easier searching.
 */
export async function describeImage(base64Image: string): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const prompt = "Describe this lost/found item in detail. Mention color, brand, distinct features, and type. Keep it under 50 words.";
  
  const contents = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    },
    {text: prompt}
  ]

  const result = await genAI.models.generateContent({
    model: model,
    contents: contents
  }); 

  if (!result.text) {
    return "Failed to describe image";
  }

  return result.text;
}

/**
 * 2. HELPER: Converts text (description or search query) into Numbers (Vector)
 */
export async function generateEmbedding(text: string): Promise<number []> {
  
  const response = await genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [text],
        config: {
          outputDimensionality: 768,
          taskType: 'SEMANTIC_SIMILARITY',
        }
    });

  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Failed to embed text");
  }

  return vector;
}

/**
 * FEATURE 1: Detect Similarity
 * Call this when a user UPLOADS an item.
 */
export async function findSimilarItemsByImage(base64Image: string) {
  // Step A: Get text description of the image
  const description = await describeImage(base64Image);
  
  // Step B: Convert that description to a vector
  const vector = await generateEmbedding(description);

  // Step C: Search database using raw SQL (Prisma limitation workaround)
  // We look for items with matching vectors
  const vectorString = `[${vector.join(",")}]`;
  
  const items = await prisma.$queryRaw`
    SELECT id, name, description, "imageUrl", 
    1 - (embedding <=> ${vectorString}::vector) as similarity
    FROM item
    WHERE embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT 5;
  `;

  return { description, similarItems: items };
}

/**
 * FEATURE 1 (Part 2): Save Item with Embedding
 * Call this AFTER finding similarities, if user decides to post anyway.
 */
export async function saveItemWithEmbedding(itemData: any, base64Image: string) {
  const description = await describeImage(base64Image);
  const vector = await generateEmbedding(description);
  const vectorString = `[${vector.join(",")}]`;

  // We must use $executeRaw to insert the vector data
  await prisma.$executeRaw`
    INSERT INTO item (id, "userId", type, name, description, "imageUrl", status, embedding, "updatedAt")
    VALUES (
      ${crypto.randomUUID()}, 
      ${itemData.userId}, 
      ${itemData.type}::"ItemType", 
      ${itemData.name}, 
      ${description}, 
      ${itemData.imageUrl}, 
      'LOOKING'::"ItemStatus", 
      ${vectorString}::vector,
      NOW()
    )
  `;
}

/**
 * FEATURE 2: Chat Search
 * Call this when user chats with the bot.
 */
export async function chatWithAI(userQuery: string) {
  // Step A: Convert user query to vector
  const vector = await generateEmbedding(userQuery);
  const vectorString = `[${vector.join(",")}]`;

  // Step B: Find relevant items in DB
  const relevantItems: any[] = await prisma.$queryRaw`
    SELECT id, name, description, location, date
    FROM item
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT 5;
  `;

  // Step C: Ask Gemini to answer using the found items
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are a helpful Lost and Found assistant.
    User is looking for: "${userQuery}"
    
    Here are the most similar items found in the database:
    ${JSON.stringify(relevantItems)}
    
    If the items match, tell the user specific details (Item ID, Name, Location). 
    If nothing matches perfectly, say so politely and suggest they keep looking.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}