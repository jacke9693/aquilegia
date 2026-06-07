import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  getFinanceEligibilityProfileByUserId,
  upsertFinanceEligibilityProfile,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

const upsertEligibilitySchema = z.object({
  age: z.number().int().min(18).optional(),
  monthlyIncomeSek: z.number().int().nonnegative().optional(),
  paymentRemarksCount: z.number().int().min(0).optional(),
  activeKronofogdenDebt: z.boolean().optional(),
  yearsInSweden: z.number().int().min(0).optional(),
  purpose: z
    .enum([
      "personal-loan",
      "business-loan",
      "investment",
      "savings",
      "pension",
    ])
    .optional(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const profile = await getFinanceEligibilityProfileByUserId({
    userId: session.user.id,
  });

  return Response.json({ profile }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  let payload: z.infer<typeof upsertEligibilitySchema>;

  try {
    payload = upsertEligibilitySchema.parse(await request.json());
  } catch {
    return new ChatbotError("bad_request:api").toResponse();
  }

  await upsertFinanceEligibilityProfile({
    userId: session.user.id,
    ...payload,
  });

  const profile = await getFinanceEligibilityProfileByUserId({
    userId: session.user.id,
  });

  return Response.json({ profile }, { status: 200 });
}
