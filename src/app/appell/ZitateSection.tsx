import { readFile } from "node:fs/promises";
import path from "node:path";
import QuoteCarouselSection, { type QuoteCarouselItem } from "./QuoteCarouselSection";

function parseCsvLine(line: string): string[] {
  return line
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((value) => value.trim().replace(/^"(.*)"$/, "$1").replace(/""/g, '"'));
}

async function loadQuotes(): Promise<QuoteCarouselItem[]> {
  const csvPath = path.join(
    process.cwd(),
    "scripts",
    "signatories_websearch_checked_cleaned.csv"
  );
  const csv = await readFile(csvPath, "utf8");
  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return [];
  }

  const [header, ...rows] = lines;
  const columns = parseCsvLine(header);
  const nameIndex = columns.indexOf("normalized_name");
  const positionIndex = columns.indexOf("final_position");
  const quoteIndex = columns.indexOf("quote");

  if (nameIndex === -1 || positionIndex === -1 || quoteIndex === -1) {
    return [];
  }

  return rows
    .map((row) => parseCsvLine(row))
    .map((columnsInRow) => ({
      name: columnsInRow[nameIndex] ?? "",
      subtitle: columnsInRow[positionIndex] ?? "",
      text: columnsInRow[quoteIndex] ?? "",
    }))
    .filter((entry) => entry.name !== "" && entry.subtitle !== "" && entry.text !== "");
}

export default async function ZitateSection() {
  const quotes = await loadQuotes();
  if (quotes.length === 0) {
    return null;
  }

  return (
    <QuoteCarouselSection heading="Zitate" quotes={quotes} dotsAriaLabel="Zitat auswählen" />
  );
}
