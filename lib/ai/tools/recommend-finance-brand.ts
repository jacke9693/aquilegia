import { tool } from "ai";
import { z } from "zod";
import { SWEDEN_FINANCE_BRAND_RULES } from "@/lib/compliance/brands";

export const recommendFinanceBrand = tool({
  description: `Recommend a specific Swedish finance brand by displaying a structured product card 
that includes the representative APR example, all mandatory disclosures, and an affiliate CTA.

ONLY call this tool when ALL of the following eligibility fields are already known for the user:
age, monthlyIncomeSek, paymentRemarks, activeKronofogdenDebt, yearsInSweden, purpose.

Do NOT call this tool if any eligibility field is missing — collect the missing fields first.
Do NOT fabricate brand names — only use names from the catalog (e.g. "Bank Norwegian", "Lysa", "Reducero").`,
  inputSchema: z.object({
    brandName: z
      .string()
      .describe(
        "Exact brand name as listed in the catalog, e.g. 'Bank Norwegian', 'Lysa', 'Reducero'."
      ),
  }),
  execute: async ({ brandName }) => {
    const normalized = brandName.toLowerCase().trim();
    const match = SWEDEN_FINANCE_BRAND_RULES.find(
      (r) =>
        r.brand.toLowerCase() === normalized ||
        r.aliases?.some((a) => a.toLowerCase() === normalized)
    );

    if (!match) {
      return {
        error: `Brand "${brandName}" was not found in the compliance catalog. Use only catalog-listed brands.`,
      };
    }

    return match;
  },
});
