import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexClient({
  address: process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3000",
});

async function seed() {
  console.log("Seeding tasks...");
  const result = await client.mutation(api.tasks.seed);
  console.log("Seed result:", result);
}

seed().catch(console.error);
