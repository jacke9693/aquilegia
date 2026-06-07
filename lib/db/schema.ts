import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  name: text("name"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  isAnonymous: boolean("isAnonymous").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.chatId, table.messageId] }),
  })
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.createdAt] }),
  })
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  "Stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

export const financeEligibilityProfile = pgTable("FinanceEligibilityProfile", {
  userId: uuid("userId")
    .primaryKey()
    .notNull()
    .references(() => user.id),
  age: integer("age"),
  monthlyIncomeSek: integer("monthlyIncomeSek"),
  paymentRemarksCount: integer("paymentRemarksCount"),
  activeKronofogdenDebt: boolean("activeKronofogdenDebt"),
  yearsInSweden: integer("yearsInSweden"),
  purpose: varchar("purpose", {
    enum: [
      "personal-loan",
      "business-loan",
      "investment",
      "savings",
      "pension",
    ],
  }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type FinanceEligibilityProfile = InferSelectModel<
  typeof financeEligibilityProfile
>;

export const financeBrandRule = pgTable("FinanceBrandRule", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  brand: text("brand").notNull(),
  category: varchar("category", {
    enum: [
      "loan",
      "loan-comparison",
      "business-loan",
      "investment",
      "savings",
      "pawn",
      "pension",
      "currency",
      "tool",
    ],
  }).notNull(),
  representativeExampleSv: text("representativeExampleSv"),
  requiresHighCostWarning: boolean("requiresHighCostWarning")
    .notNull()
    .default(false),
  requiresInvestmentWarning: boolean("requiresInvestmentWarning")
    .notNull()
    .default(false),
  requiresLysaWarning: boolean("requiresLysaWarning")
    .notNull()
    .default(false),
  forbidCrypto: boolean("forbidCrypto").notNull().default(false),
  requiredAffiliateDisclosure: boolean("requiredAffiliateDisclosure")
    .notNull()
    .default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type FinanceBrandRule = InferSelectModel<typeof financeBrandRule>;

export const financeApproval = pgTable("FinanceApproval", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  brand: text("brand").notNull(),
  approvalType: varchar("approvalType", {
    enum: ["channel", "email", "sms", "content", "manual", "material"],
  }).notNull(),
  status: varchar("status", {
    enum: ["pending", "approved", "rejected", "not-required"],
  })
    .notNull()
    .default("pending"),
  notes: text("notes"),
  approvedBy: text("approvedBy"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type FinanceApproval = InferSelectModel<typeof financeApproval>;
