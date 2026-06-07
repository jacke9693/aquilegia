import { auth } from "@/app/(auth)/auth";
import { formatMissingEligibilityFields, missingEligibilityFields } from "@/lib/compliance/rules";
import { getFinanceEligibilityProfileByUserId } from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const profile = await getFinanceEligibilityProfileByUserId({
    userId: session.user.id,
  });

  const normalizedProfile = {
    age: profile?.age ?? undefined,
    monthlyIncomeSek: profile?.monthlyIncomeSek ?? undefined,
    paymentRemarks:
      typeof profile?.paymentRemarksCount === "number"
        ? profile.paymentRemarksCount
        : undefined,
    activeKronofogdenDebt: profile?.activeKronofogdenDebt ?? undefined,
    yearsInSweden: profile?.yearsInSweden ?? undefined,
    purpose: profile?.purpose ?? undefined,
  };

  const missingFields = missingEligibilityFields(normalizedProfile);
  const labels = formatMissingEligibilityFields(missingFields);

  return Response.json(
    {
      profile,
      eligibilityComplete: missingFields.length === 0,
      missingFields,
      missingFieldsLabels: labels,
    },
    { status: 200 }
  );
}
