import { streamText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

const chartSystemPrompt = `You are a financial chart data generator for a Swedish finance affiliate service.
Generate a JSON object that describes a chart for the requested financial data.

Output ONLY valid JSON — no markdown fences, no explanation, no surrounding text.

Schema:
{
  "chartType": "bar" | "line" | "area" | "pie",
  "title": string,
  "xKey": string,
  "yKeys": [{ "key": string, "label": string }],
  "data": [{ [key: string]: string | number }],
  "unit": string (optional, e.g. "SEK", "%", "kr/mån"),
  "disclaimer": string (optional, compliance/risk notice in Swedish)
}

Finance chart guidelines:
- APR/loan comparisons → chartType "bar", xKey "varumarke", one yKey "apr" (number, percent)
- Monthly payment schedules → chartType "area", xKey "manad", yKeys "kapital" + "ranta"
- Amortization/balance over time → chartType "line", xKey "manad", yKey "aterstående"
- Payment composition → chartType "pie", xKey "kategori", yKey "belopp"
- Use Swedish labels for xKey values and yKey labels
- Always add a disclaimer for loan/investment charts:
  - Loans: "Representativa exempel. Faktisk ranta beror pa kreditbedömning."
  - Investment: "Historisk avkastning ar ingen garanti for framtida avkastning."
- Max 12 data points
- APR values as plain numbers (e.g. 11.36 not "11.36%")
- Monetary values as plain integers in SEK`;

export const chartDocumentHandler = createDocumentHandler<"chart">({
  kind: "chart",
  onCreateDocument: async ({ title, dataStream, modelId }) => {
    let draftContent = "";

    const { fullStream } = streamText({
      model: getLanguageModel(modelId),
      system: chartSystemPrompt,
      prompt: title,
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.text;
        dataStream.write({
          type: "data-chartDelta",
          data: draftContent,
          transient: true,
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream, modelId }) => {
    let draftContent = "";

    const context = `Existing chart JSON:\n${document.content}\n\nUpdate request: ${description}`;

    const { fullStream } = streamText({
      model: getLanguageModel(modelId),
      system: `${chartSystemPrompt}\n\nUpdate the existing chart JSON based on the update request. Output ONLY the full updated JSON.`,
      prompt: context,
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.text;
        dataStream.write({
          type: "data-chartDelta",
          data: draftContent,
          transient: true,
        });
      }
    }

    return draftContent;
  },
});
