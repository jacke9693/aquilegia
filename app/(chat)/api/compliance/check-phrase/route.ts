import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  enforceFinanceAssistantText,
  findLoanStopWordViolations,
  validateInvestmentCopy,
} from "@/lib/compliance/rules";
import { ChatbotError } from "@/lib/errors";

const checkPhraseSchema = z.object({
  text: z.string().min(1),
  brand: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  let payload: z.infer<typeof checkPhraseSchema>;

  try {
    payload = checkPhraseSchema.parse(await request.json());
  } catch {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const phraseViolations = findLoanStopWordViolations(payload.text);
  const investmentViolations = payload.brand
    ? validateInvestmentCopy({ brand: payload.brand, content: payload.text })
    : [];
  const enforcement = enforceFinanceAssistantText(payload.text, payload.text);

  return Response.json(
    {
      isCompliant: enforcement.blocked === false,
      violations: [...phraseViolations, ...investmentViolations],
      rewrittenText: enforcement.text,
      injectedDisclosures: enforcement.injectedDisclosures,
    },
    { status: 200 }
  );
}
