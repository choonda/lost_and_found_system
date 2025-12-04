// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//     console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash", 
//     });

//     const result = await model.generateContent(prompt);

//     return NextResponse.json({
//       reply: result.response.text(),
//     });
//   } catch (err: any) {
//     console.error("AI ERROR:", err);
//     return NextResponse.json(
//       { reply: "AI failed: " + err.message },
//       { status: 500 }
//     );
//   }
// }
