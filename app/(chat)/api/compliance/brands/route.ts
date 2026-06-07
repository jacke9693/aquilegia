import { auth } from "@/app/(auth)/auth";
import { listFinanceBrandTemplates } from "@/lib/compliance/template";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  return Response.json(
    {
      market: "SE",
      count: listFinanceBrandTemplates().length,
      brands: listFinanceBrandTemplates(),
    },
    { status: 200 }
  );
}
