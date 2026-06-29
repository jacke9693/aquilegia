import { streamText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

const chartSystemPrompt = `You are a financial chart data generator for a Swedish finance affiliate service.
Generate a JSON object that describes a chart for the requested financial data.

Output ONLY valid JSON — no markdown fences, no explanation, no surrounding text. Start directly with {.

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

DEFAULT LOAN ASSUMPTIONS (use when not specified):
- Loan amount: 100 000 SEK
- Term: 5 years (60 months), show every 6 months = 10 data points
- Nominal interest rate: 8.5% per year → monthly rate r = 0.085/12
- Monthly annuity payment = P * r / (1 - (1+r)^-n) ≈ 2 049 kr/mån
- Effective APR ≈ 9.4% (nominal + fees)
- Amortization increases each month, interest decreases

CHART TYPE RULES:
- APR/brand comparison → bar, xKey "varumärke", yKey key="apr" label="Effektiv årsränta", unit="%"
- Monthly payment split over time → area, xKey "månad", yKeys [{key:"kapital",label:"Amortering"},{key:"ränta",label:"Räntekostnad"}], unit="SEK"
- Remaining balance over time → line, xKey "månad", yKey key="saldo" label="Återstående skuld", unit="SEK"
- Payment composition totals → pie, xKey "kategori", yKey key="belopp" label="Belopp", unit="SEK"

CRITICAL — these mistakes cause blank charts:
1. ALL numeric values MUST be plain numbers, never strings: write 11.36 not "11.36"
2. xKey in every data row MUST use the exact same key name as the xKey field
3. Each yKey "key" MUST appear in every data row with that exact property name
4. Do not add extra properties to data rows that are not declared in yKeys

EXAMPLE — correct area chart (100k, 5y, 8.5%):
{"chartType":"area","title":"Amortering vs räntekostnad — 100 000 kr, 5 år, 8,5%","xKey":"månad","yKeys":[{"key":"kapital","label":"Amortering"},{"key":"ränta","label":"Räntekostnad"}],"unit":"SEK","data":[{"månad":"Mån 1","kapital":1340,"ränta":708},{"månad":"Mån 6","kapital":1388,"ränta":661},{"månad":"Mån 12","kapital":1447,"ränta":602},{"månad":"Mån 18","kapital":1509,"ränta":540},{"månad":"Mån 24","kapital":1574,"ränta":475},{"månad":"Mån 30","kapital":1642,"ränta":407},{"månad":"Mån 36","kapital":1713,"ränta":336},{"månad":"Mån 42","kapital":1787,"ränta":262},{"månad":"Mån 48","kapital":1864,"ränta":185},{"månad":"Mån 54","kapital":1945,"ränta":104}],"disclaimer":"Representativa exempel. Faktisk ränta beror på kreditbedömning."}`;

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
