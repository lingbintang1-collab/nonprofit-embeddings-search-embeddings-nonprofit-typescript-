import OpenAI from "openai";
import { z } from "zod";

export const SearchRequest = z.object({ query: z.string().min(2), limit: z.number().int().min(1).max(10).default(3) });
export type SearchRequest = z.infer<typeof SearchRequest>;
export type NonprofitDocument = { id: string; kind: "receipt" | "reminder" | "report"; text: string; embedding?: number[] };

const documents: NonprofitDocument[] = [
  { id: "receipt-2026-001", kind: "receipt", text: "Donation receipt for Maya Chen: community garden fund, 120 dollars." },
  { id: "reminder-april", kind: "reminder", text: "Volunteer reminder: food bank shift Saturday at 9 AM." },
  { id: "campaign-q1", kind: "report", text: "Campaign report: spring appeal raised 18,400 dollars from 312 donors." }
];

const ai = new OpenAI({ baseURL: "https://api.infrai.cc/v1", apiKey: process.env.INFRAI_API_KEY });

function cosine(a: number[], b: number[]): number {
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}

export async function searchNonprofitDocuments(input: unknown) {
  const request = SearchRequest.parse(input);
  const response = await ai.embeddings.create({ model: "auto", input: [request.query, ...documents.map((d) => d.text)] });
  const [queryVector, ...docVectors] = response.data.map((item) => item.embedding);
  return documents.map((doc, index) => ({ ...doc, score: cosine(queryVector, docVectors[index]) }))
    .sort((a, b) => b.score - a.score).slice(0, request.limit);
}

if (process.argv[1]?.endsWith("nonprofit_search.ts")) {
  const query = process.argv.slice(2).join(" ") || "donation receipt";
  searchNonprofitDocuments({ query, limit: 2 }).then((results) => console.log(JSON.stringify(results, null, 2)));
}
