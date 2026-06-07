import { FINANCE_LOAN_STOP_WORDS } from "@/lib/constants";
import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";
import { getFinanceComplianceTemplate as getTemplate } from "@/lib/compliance/template";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  return Response.json(
    {
      templateVersion: getTemplate().version,
      market: getTemplate().market,
      locale: getTemplate().locale,
      fallbackLocale: getTemplate().fallbackLocale,
      requiredEligibilityFields: getTemplate().policy.requiredEligibilityFields,
      loanStopWords: FINANCE_LOAN_STOP_WORDS,
      highCostAprThreshold: getTemplate().policy.highCostAprThreshold,
    },
    { status: 200 }
  );
}
