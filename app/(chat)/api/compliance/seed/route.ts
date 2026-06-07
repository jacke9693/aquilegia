import { auth } from "@/app/(auth)/auth";
import { buildFinanceDbSeedPayload } from "@/lib/compliance/seed";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  return Response.json(
    {
      seed: buildFinanceDbSeedPayload(),
    },
    { status: 200 }
  );
}