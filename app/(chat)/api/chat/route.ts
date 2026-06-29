import { geolocation, ipAddress } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
} from "ai";
import { checkBotId } from "botid/server";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { auth, type UserType } from "@/app/(auth)/auth";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import {
  allowedModelIds,
  chatModels,
  DEFAULT_CHAT_MODEL,
  getCapabilities,
} from "@/lib/ai/models";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { editDocument } from "@/lib/ai/tools/edit-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { recommendFinanceBrand } from "@/lib/ai/tools/recommend-finance-brand";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getFinanceEligibilityProfileByUserId,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  upsertFinanceEligibilityProfile,
  updateChatTitleById,
  updateMessage,
} from "@/lib/db/queries";
import type { DBMessage } from "@/lib/db/schema";
import { ChatbotError } from "@/lib/errors";
import { checkIpRateLimit } from "@/lib/ratelimit";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import {
  extractTextFromMessageParts,
  enforceFinanceComplianceOnAssistantParts,
  formatMissingEligibilityFields,
  missingEligibilityFields,
  parseEligibilityProfileFromText,
} from "@/lib/compliance/rules";
import { detectMentionedFinanceBrands } from "@/lib/compliance/brands";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

function getStreamContext() {
  try {
    return createResumableStreamContext({ waitUntil: after });
  } catch (_) {
    return null;
  }
}

export { getStreamContext };

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  try {
    const { id, message, messages, selectedChatModel, selectedVisibilityType } =
      requestBody;

    const [, session] = await Promise.all([
      checkBotId().catch(() => null),
      auth(),
    ]);

    if (!session?.user) {
      return new ChatbotError("unauthorized:chat").toResponse();
    }

    const chatModel = allowedModelIds.has(selectedChatModel)
      ? selectedChatModel
      : DEFAULT_CHAT_MODEL;

    await checkIpRateLimit(ipAddress(request));

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 1,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerHour) {
      return new ChatbotError("rate_limit:chat").toResponse();
    }

    const isToolApprovalFlow = Boolean(messages);

    const chat = await getChatById({ id });
    let messagesFromDb: DBMessage[] = [];
    let titlePromise: Promise<string> | null = null;

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatbotError("forbidden:chat").toResponse();
      }
      messagesFromDb = await getMessagesByChatId({ id });
    } else if (message?.role === "user") {
      await saveChat({
        id,
        userId: session.user.id,
        title: "New chat",
        visibility: selectedVisibilityType,
      });
      titlePromise = generateTitleFromUserMessage({ message });
    }

    let uiMessages: ChatMessage[];

    if (isToolApprovalFlow && messages) {
      const dbMessages = convertToUIMessages(messagesFromDb);
      const approvalStates = new Map(
        messages.flatMap(
          (m) =>
            m.parts
              ?.filter(
                (p: Record<string, unknown>) =>
                  p.state === "approval-responded" ||
                  p.state === "output-denied"
              )
              .map((p: Record<string, unknown>) => [
                String(p.toolCallId ?? ""),
                p,
              ]) ?? []
        )
      );
      uiMessages = dbMessages.map((msg) => ({
        ...msg,
        parts: msg.parts.map((part) => {
          if (
            "toolCallId" in part &&
            approvalStates.has(String(part.toolCallId))
          ) {
            return { ...part, ...approvalStates.get(String(part.toolCallId)) };
          }
          return part;
        }),
      })) as ChatMessage[];
    } else {
      uiMessages = [
        ...convertToUIMessages(messagesFromDb),
        message as ChatMessage,
      ];
    }

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    if (message?.role === "user") {
      const userText = extractTextFromMessageParts(message.parts);
      if (userText) {
        const parsedProfile = parseEligibilityProfileFromText(userText);
        const shouldUpsert =
          typeof parsedProfile.age === "number" ||
          typeof parsedProfile.monthlyIncomeSek === "number" ||
          typeof parsedProfile.activeKronofogdenDebt === "boolean" ||
          typeof parsedProfile.yearsInSweden === "number" ||
          typeof parsedProfile.purpose === "string" ||
          parsedProfile.paymentRemarks === "no" ||
          parsedProfile.paymentRemarks === "yes" ||
          typeof parsedProfile.paymentRemarks === "number";

        if (shouldUpsert) {
          await upsertFinanceEligibilityProfile({
            userId: session.user.id,
            age: parsedProfile.age,
            monthlyIncomeSek: parsedProfile.monthlyIncomeSek,
            activeKronofogdenDebt: parsedProfile.activeKronofogdenDebt,
            yearsInSweden: parsedProfile.yearsInSweden,
            purpose: parsedProfile.purpose,
            paymentRemarksCount:
              typeof parsedProfile.paymentRemarks === "number"
                ? parsedProfile.paymentRemarks
                : parsedProfile.paymentRemarks === "no"
                  ? 0
                  : parsedProfile.paymentRemarks === "yes"
                    ? 1
                    : undefined,
          });
        }
      }

      await saveMessages({
        messages: [
          {
            chatId: id,
            id: message.id,
            role: "user",
            parts: message.parts,
            attachments: [],
            createdAt: new Date(),
          },
        ],
      });
    }

    const modelConfig = chatModels.find((m) => m.id === chatModel);
    const modelCapabilities = await getCapabilities();
    const capabilities = modelCapabilities[chatModel];
    const isReasoningModel = capabilities?.reasoning === true;
    const supportsTools = capabilities?.tools === true;
    const storedEligibilityProfile = await getFinanceEligibilityProfileByUserId({
      userId: session.user.id,
    });

    const profileContextText = storedEligibilityProfile
      ? [
          `age: ${storedEligibilityProfile.age ?? "unknown"}`,
          `monthlyIncomeSek: ${storedEligibilityProfile.monthlyIncomeSek ?? "unknown"}`,
          `paymentRemarks: ${storedEligibilityProfile.paymentRemarksCount ?? "unknown"}`,
          `activeKronofogdenDebt: ${
            typeof storedEligibilityProfile.activeKronofogdenDebt === "boolean"
              ? storedEligibilityProfile.activeKronofogdenDebt
              : "unknown"
          }`,
          `yearsInSweden: ${storedEligibilityProfile.yearsInSweden ?? "unknown"}`,
          `purpose: ${storedEligibilityProfile.purpose ?? "unknown"}`,
        ].join("\n")
      : "";

    const modelMessages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      originalMessages: isToolApprovalFlow ? uiMessages : undefined,
      execute: async ({ writer: dataStream }) => {
        const latestUserText = message?.role === "user" ? extractTextFromMessageParts(message.parts) : "";
        const mentionedBrands = latestUserText
          ? detectMentionedFinanceBrands(latestUserText)
          : [];

        if (mentionedBrands.length > 0) {
          const parsedProfile = parseEligibilityProfileFromText(latestUserText);

          const mergedProfile = {
            age: parsedProfile.age ?? storedEligibilityProfile?.age ?? undefined,
            monthlyIncomeSek:
              parsedProfile.monthlyIncomeSek ??
              storedEligibilityProfile?.monthlyIncomeSek ??
              undefined,
            paymentRemarks:
              typeof parsedProfile.paymentRemarks === "number"
                ? parsedProfile.paymentRemarks
                : parsedProfile.paymentRemarks === "no"
                  ? 0
                  : parsedProfile.paymentRemarks === "yes"
                    ? 1
                    : typeof storedEligibilityProfile?.paymentRemarksCount === "number"
                      ? storedEligibilityProfile.paymentRemarksCount
                      : undefined,
            activeKronofogdenDebt:
              typeof parsedProfile.activeKronofogdenDebt === "boolean"
                ? parsedProfile.activeKronofogdenDebt
                : storedEligibilityProfile?.activeKronofogdenDebt ?? undefined,
            yearsInSweden:
              parsedProfile.yearsInSweden ??
              storedEligibilityProfile?.yearsInSweden ??
              undefined,
            purpose: parsedProfile.purpose ?? storedEligibilityProfile?.purpose ?? undefined,
          };

          const missingFields = missingEligibilityFields(mergedProfile);
          if (missingFields.length > 0) {
            const labels = formatMissingEligibilityFields(missingFields);
            dataStream.write({
              type: "data-complianceCard",
              data: {
                titleSv: "Behorighetsuppgifter kravs",
                titleEn: "Eligibility details required",
                bodySv: `Fyll i innan varumärkeserbjudanden visas: ${labels.sv}`,
                bodyEn: `Provide before brand offers can be shown: ${labels.en}`,
                kind: "eligibility",
                brand: mentionedBrands[0]?.brand,
              },
              transient: true,
            });
          }
        }

        const result = streamText({
          model: getLanguageModel(chatModel),
          system: systemPrompt({
            requestHints,
            supportsTools,
            complianceContext: profileContextText || undefined,
          }),
          messages: modelMessages,
          stopWhen: stepCountIs(5),
          experimental_activeTools:
            isReasoningModel && !supportsTools
              ? []
              : [
                  "getWeather",
                  "createDocument",
                  "editDocument",
                  "updateDocument",
                  "requestSuggestions",
                  "recommendFinanceBrand",
                ],
          providerOptions: {
            ...(modelConfig?.gatewayOrder && {
              gateway: { order: modelConfig.gatewayOrder },
            }),
            ...(modelConfig?.reasoningEffort && {
              openai: { reasoningEffort: modelConfig.reasoningEffort },
            }),
          },
          tools: {
            getWeather,
            recommendFinanceBrand,
            createDocument: createDocument({
              session,
              dataStream,
              modelId: chatModel,
            }),
            editDocument: editDocument({ dataStream, session }),
            updateDocument: updateDocument({
              session,
              dataStream,
              modelId: chatModel,
            }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
              modelId: chatModel,
            }),
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        dataStream.merge(
          result.toUIMessageStream({ sendReasoning: isReasoningModel })
        );

        if (titlePromise) {
          try {
            const title = await titlePromise;
            dataStream.write({ type: "data-chat-title", data: title });
            updateChatTitleById({ chatId: id, title });
          } catch (_) {
            /* non-fatal */
          }
        }
      },
      generateId: generateUUID,
      onFinish: async ({ messages: finishedMessages }) => {
        const userConversationText = uiMessages
          .filter((item) => item.role === "user")
          .map((item) => extractTextFromMessageParts(item.parts))
          .filter(Boolean)
          .join("\n");
        const complianceContext = profileContextText
          ? `${profileContextText}\n${userConversationText}`
          : userConversationText;

        if (isToolApprovalFlow) {
          for (const finishedMsg of finishedMessages) {
            const existingMsg = uiMessages.find((m) => m.id === finishedMsg.id);
            const compliantParts =
              finishedMsg.role === "assistant"
                ? enforceFinanceComplianceOnAssistantParts(
                    finishedMsg.parts,
                    complianceContext
                  )
                : finishedMsg.parts;

            if (existingMsg) {
              await updateMessage({
                id: finishedMsg.id,
                parts: compliantParts,
              });
            } else {
              await saveMessages({
                messages: [
                  {
                    id: finishedMsg.id,
                    role: finishedMsg.role,
                    parts: compliantParts,
                    createdAt: new Date(),
                    attachments: [],
                    chatId: id,
                  },
                ],
              });
            }
          }
        } else if (finishedMessages.length > 0) {
          await saveMessages({
            messages: finishedMessages.map((currentMessage) => ({
              id: currentMessage.id,
              role: currentMessage.role,
              parts:
                currentMessage.role === "assistant"
                  ? enforceFinanceComplianceOnAssistantParts(
                      currentMessage.parts,
                      complianceContext
                    )
                  : currentMessage.parts,
              createdAt: new Date(),
              attachments: [],
              chatId: id,
            })),
          });
        }
      },
      onError: (error) => {
        if (
          error instanceof Error &&
          error.message?.includes(
            "AI Gateway requires a valid credit card on file to service requests"
          )
        ) {
          return "AI Gateway requires a valid credit card on file to service requests. Please visit https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card to add a card and unlock your free credits.";
        }
        return "Oops, an error occurred!";
      },
    });

    return createUIMessageStreamResponse({
      stream,
      async consumeSseStream({ stream: sseStream }) {
        if (!process.env.REDIS_URL) {
          return;
        }
        try {
          const streamContext = getStreamContext();
          if (streamContext) {
            const streamId = generateId();
            await createStreamId({ streamId, chatId: id });
            await streamContext.createNewResumableStream(
              streamId,
              () => sseStream
            );
          }
        } catch (_) {
          /* non-critical */
        }
      },
    });
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatbotError) {
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      return new ChatbotError("bad_request:activate_gateway").toResponse();
    }

    console.error("Unhandled error in chat API:", error, { vercelId });
    return new ChatbotError("offline:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const chat = await getChatById({ id });

  if (chat?.userId !== session.user.id) {
    return new ChatbotError("forbidden:chat").toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
