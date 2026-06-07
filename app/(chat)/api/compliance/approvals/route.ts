import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  getFinanceApprovalsByBrand,
  upsertFinanceApproval,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

const upsertApprovalSchema = z.object({
  brand: z.string().min(1),
  approvalType: z.enum(["channel", "email", "sms", "content", "manual", "material"]),
  status: z.enum(["pending", "approved", "rejected", "not-required"]),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");

  if (!brand) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const approvals = await getFinanceApprovalsByBrand({ brand });

  return Response.json({ approvals }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  let payload: z.infer<typeof upsertApprovalSchema>;

  try {
    payload = upsertApprovalSchema.parse(await request.json());
  } catch {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const approval = await upsertFinanceApproval(payload);

  return Response.json({ approval }, { status: 200 });
}
