import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { reviewSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = `Review the following code for readability, structure, and maintainability. Provide specific, actionable feedback.

                    Code:
                    \`\`\`
                    ${code}
                    \`\`\`

                    Focus on:
                    - Readability: naming conventions, clarity, comments, code organization
                    - Structure: separation of concerns, modularity, design patterns
                    - Maintainability: complexity, extensibility, potential bugs, technical debt

                    Provide constructive feedback with specific examples.`;

    const result = streamObject({
      // model: google("gemini-2.0-flash-lite"),
      model: google("gemini-2.5-flash"),
      schema: reviewSchema,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to review code" }, { status: 500 });
  }
}
