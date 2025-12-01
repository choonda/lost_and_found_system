import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});
const prisma = new PrismaClient();

// Converts an image URL to a base64 string
export async function imageUrlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer.toString("base64");
}

// Generates a text description from an image 
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


//Converts text (description or search query) into Numbers (Vector)
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

//Similarity Check 
export async function findSimilarItemsByImage(base64Image: string) {

  const description = await describeImage(base64Image);
  const vector = await generateEmbedding(description);
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

//AI Chat box
export async function chatWithAI(userQuery: string) {

  const vector = await generateEmbedding(userQuery);
  const vectorString = `[${vector.join(",")}]`;

  const relevantItems: any[] = await prisma.$queryRaw`
    SELECT id, name, description, location, date
    FROM item
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT 5;
  `;

  const model = "gemini-2.5-flash"
  
  const prompt = `
    You are a helpful Lost and Found assistant.
    User is looking for: "${userQuery}"
    
    Here are the most similar items found in the database:
    ${JSON.stringify(relevantItems)}
    
    If the items match, tell the user specific details (Item ID, Name, Location). 
    If nothing matches perfectly, say so politely and suggest they keep looking.
  `;

  const result = await genAI.models.generateContent({
    model: model,
    contents: [{text: prompt}]
  });
  return result.text;
}