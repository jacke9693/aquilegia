import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
import type { ArtifactKind } from "@/components/chat/artifact";
import type { createDocument } from "./ai/tools/create-document";
import type { getWeather } from "./ai/tools/get-weather";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { updateDocument } from "./ai/tools/update-document";
import type { Suggestion } from "./db/schema";

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export const eligibilityPurposeSchema = z.enum([
  "personal-loan",
  "business-loan",
  "investment",
  "savings",
  "pension",
]);

export const userEligibilityProfileSchema = z.object({
  age: z.number().int().min(18),
  monthlyIncomeSek: z.number().int().nonnegative(),
  paymentRemarks: z.union([z.literal("no"), z.literal("yes"), z.number().int().min(0)]),
  activeKronofogdenDebt: z.boolean(),
  yearsInSweden: z.number().min(0),
  purpose: eligibilityPurposeSchema,
});

export const complianceSeveritySchema = z.enum(["warning", "block"]);

export const complianceViolationSchema = z.object({
  code: z.string(),
  severity: complianceSeveritySchema,
  messageSv: z.string(),
  messageEn: z.string(),
  source: z.enum(["eligibility", "phrase", "investment", "disclosure", "brand-rule"]),
});

export const complianceCardSchema = z.object({
  titleSv: z.string(),
  titleEn: z.string(),
  bodySv: z.string(),
  bodyEn: z.string(),
  kind: z.enum(["warning", "disclosure", "risk", "eligibility"]),
  brand: z.string().optional(),
});

export type UserEligibilityProfile = z.infer<typeof userEligibilityProfileSchema>;
export type ComplianceViolation = z.infer<typeof complianceViolationSchema>;
export type ComplianceCard = z.infer<typeof complianceCardSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

export type ChatTools = {
  getWeather: weatherTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  "chat-title": string;
  complianceCard: ComplianceCard;
  complianceViolation: ComplianceViolation;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
