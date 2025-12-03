import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const prisma = new PrismaClient();

// Converts an image URL to a base64 string
export async function imageUrlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer.toString("base64");
}

// Generates a text description from an image
export async function describeImage(base64Image: string): Promise<string> {
  const model = "gemini-2.5-flash";
  const prompt =
    "Generate a highly detailed, objective description of the image content. The description must cover Object Type, Dominant Color(s), Shape/Form, Surface Pattern/Texture, and Distinct Feature(s). Keep the description concise and not exceed 50 words.";

  // Support full data URLs (e.g. "data:image/png;base64,...") by stripping the prefix
  let mimeType = "image/jpeg";
  let data = base64Image;
  if (typeof base64Image === "string" && base64Image.startsWith("data:")) {
    const match = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      data = match[2];
    } else {
      // fallback: try to split on comma
      const parts = base64Image.split(",");
      if (parts.length > 1) data = parts[1];
    }
  }

  const contents = [
    {
      inlineData: {
        mimeType,
        data,
      },
    },
    { text: prompt },
  ];

  const result = await genAI.models.generateContent({
    model: model,
    contents: contents,
  });

  // The GenAI client may expose text in different fields; prefer `text`, fall back to others.
  const text =
    (result as any).text ||
    (result as any)?.output?.[0]?.content ||
    (result as any)?.candidates?.[0]?.output;
  if (!text) {
    return "Failed to describe image";
  }

  return String(text);
}

//Converts text (description or search query) into Numbers (Vector)
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
    config: {
      outputDimensionality: 768,
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Failed to embed text");
  }

  return vector;
}

//Similarity Check
export async function findSimilarItemsByImage(base64Image: string) {
  try {
    const description = await describeImage(base64Image);
    const vector = await generateEmbedding(description);
    const vectorString = `[${vector.join(",")}]`;

    const items = await prisma.$queryRaw<any[]>`
      SELECT id, name, description, "imageUrl", 
      1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM item
      WHERE embedding IS NOT NULL AND
        (1 - (embedding <=> ${vectorString}::vector)) * 100 > 85
      ORDER BY similarity DESC
      LIMIT 5;
    `;

    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl || item.imageurl || null,
      similarity: item.similarity,
    }));

    return { description, similarItems: formattedItems };
  } catch (err) {
    console.error("findSimilarItemsByImage error:", err);
    throw err;
  }
}

//sensesitive content filter
export async function filterSensitiveContent(userQuery: string) {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a content moderation AI. 
    Analyze the following user query for sensitive or inappropriate content.
    If the content is safe, respond with "SAFE". 
    If it contains sensitive content, respond with "SENSITIVE".
    User query: "${userQuery}"
  `;

  const result = await genAI.models.generateContent({
    model: model,
    contents: [{ text: prompt }],
  });

  const response = result.text?.trim().toUpperCase();
  if (response === "SENSITIVE") {
    return true;
  } else if (response === "SAFE") {
    return false;
  } else {
    throw new Error("Unexpected response from content filter");
  }
}

//AI Chat box
export async function chatWithAI(userQuery: string) {
  const vector = await generateEmbedding(userQuery);
  const vectorString = `[${vector.join(",")}]`;

  const relevantItems: any[] = await prisma.$queryRaw`
    SELECT id, name, description, location, date
    FROM item
    WHERE embedding IS NOT NULL
      AND (1 - (embedding <=> ${vectorString}::vector)) * 100 > 85
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT 5;
  `;

  const model = "gemini-2.5-flash";

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
    contents: [{ text: prompt }],
  });
  return result.text;
}
