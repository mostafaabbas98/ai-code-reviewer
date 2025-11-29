import { z } from "zod";

export const reviewSchema = z.object({
  readability: z.object({
    score: z.number().min(0).max(10),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  structure: z.object({
    score: z.number().min(0).max(10),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  maintainability: z.object({
    score: z.number().min(0).max(10),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  positiveNote: z.string(),
});
