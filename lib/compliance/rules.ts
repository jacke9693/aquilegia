import {
  FINANCE_AFFILIATE_DISCLOSURE_SV,
  FINANCE_ETORO_FORBIDDEN_TOPICS,
  FINANCE_HIGH_COST_APR_THRESHOLD,
  FINANCE_HIGH_COST_BRANDS,
  FINANCE_INVESTMENT_BRANDS,
  FINANCE_INVESTMENT_WARNING_SV,
  FINANCE_LOAN_STOP_WORDS,
  FINANCE_LYSA_WARNING_SV,
} from "@/lib/constants";
import {
  detectMentionedFinanceBrands,
  HIGH_COST_WARNING_SV,
} from "@/lib/compliance/brands";
import type {
  ComplianceViolation,
  UserEligibilityProfile,
} from "@/lib/types";

export function normalizeText(input: string): string {
  return input.toLowerCase();
}

export function findLoanStopWordViolations(input: string): ComplianceViolation[] {
  const normalized = normalizeText(input);
  const violations: ComplianceViolation[] = [];

  for (const term of FINANCE_LOAN_STOP_WORDS) {
    if (normalized.includes(term)) {
      violations.push({
        code: "loan_stop_word",
        severity: "block",
        messageSv: `Otillatet ord i lantekst: ${term}`,
        messageEn: `Forbidden term in loan context: ${term}`,
        source: "phrase",
      });
    }
  }

  return violations;
}

export function isInvestmentBrand(brand: string): boolean {
  return FINANCE_INVESTMENT_BRANDS.some(
    (value) => value.toLowerCase() === brand.toLowerCase()
  );
}

export function requiresHighCostWarning(params: {
  brand: string;
  effectiveApr?: number | null;
}): boolean {
  if (
    typeof params.effectiveApr === "number" &&
    params.effectiveApr > FINANCE_HIGH_COST_APR_THRESHOLD
  ) {
    return true;
  }

  return FINANCE_HIGH_COST_BRANDS.some(
    (value) => value.toLowerCase() === params.brand.toLowerCase()
  );
}

export function validateInvestmentCopy(params: {
  brand: string;
  content: string;
}): ComplianceViolation[] {
  if (!isInvestmentBrand(params.brand)) {
    return [];
  }

  const violations: ComplianceViolation[] = [];
  const normalized = normalizeText(params.content);

  if (!normalized.includes(normalizeText(FINANCE_INVESTMENT_WARNING_SV))) {
    violations.push({
      code: "missing_investment_warning",
      severity: "block",
      messageSv: "Obligatorisk investeringsvarning saknas.",
      messageEn: "Mandatory investment risk warning is missing.",
      source: "investment",
    });
  }

  if (params.brand.toLowerCase() === "lysa") {
    if (!normalized.includes(normalizeText(FINANCE_LYSA_WARNING_SV))) {
      violations.push({
        code: "missing_lysa_warning",
        severity: "block",
        messageSv: "Lysa-specifik riskvarning saknas.",
        messageEn: "Lysa-specific risk warning is missing.",
        source: "investment",
      });
    }
  }

  if (params.brand.toLowerCase() === "etoro") {
    for (const topic of FINANCE_ETORO_FORBIDDEN_TOPICS) {
      if (normalized.includes(topic)) {
        violations.push({
          code: "etoro_crypto_forbidden",
          severity: "block",
          messageSv: "Krypto far inte namnas i eToro-innehall for Norden.",
          messageEn: "Crypto must not be mentioned in Nordic eToro content.",
          source: "investment",
        });
      }
    }
  }

  return violations;
}

export function missingEligibilityFields(
  profile: Partial<UserEligibilityProfile>
): Array<keyof UserEligibilityProfile> {
  const missing: Array<keyof UserEligibilityProfile> = [];

  if (typeof profile.age !== "number") {
    missing.push("age");
  }

  if (typeof profile.monthlyIncomeSek !== "number") {
    missing.push("monthlyIncomeSek");
  }

  if (
    typeof profile.paymentRemarks !== "number" &&
    profile.paymentRemarks !== "yes" &&
    profile.paymentRemarks !== "no"
  ) {
    missing.push("paymentRemarks");
  }

  if (typeof profile.activeKronofogdenDebt !== "boolean") {
    missing.push("activeKronofogdenDebt");
  }

  if (typeof profile.yearsInSweden !== "number") {
    missing.push("yearsInSweden");
  }

  if (typeof profile.purpose !== "string") {
    missing.push("purpose");
  }

  return missing;
}

export function formatMissingEligibilityFields(
  fields: Array<keyof UserEligibilityProfile>
) {
  const labels = fields.map((field) => {
    switch (field) {
      case "age":
        return {
          sv: "alder",
          en: "age",
        };
      case "monthlyIncomeSek":
        return {
          sv: "manadsinkomst (SEK)",
          en: "monthly income (SEK)",
        };
      case "paymentRemarks":
        return {
          sv: "betalningsanmarkningar",
          en: "payment remarks",
        };
      case "activeKronofogdenDebt":
        return {
          sv: "aktiv Kronofogden-skuld",
          en: "active Kronofogden debt",
        };
      case "yearsInSweden":
        return {
          sv: "antal ar i Sverige",
          en: "years resident in Sweden",
        };
      case "purpose":
        return {
          sv: "syfte",
          en: "purpose",
        };
      default:
        return {
          sv: field,
          en: field,
        };
    }
  });

  return {
    sv: labels.map((label) => label.sv).join(", "),
    en: labels.map((label) => label.en).join(", "),
  };
}

type MessagePart = {
  type: string;
  text?: string;
};

export type ComplianceEnforcementResult = {
  violations: ComplianceViolation[];
  text: string;
  blocked: boolean;
  injectedDisclosures: string[];
};

export function extractTextFromMessageParts(parts: unknown): string {
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .flatMap((part) => {
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return [(part as { text: string }).text];
      }

      return [];
    })
    .join("\n")
    .trim();
}

export function parseEligibilityProfileFromText(
  content: string
): Partial<UserEligibilityProfile> {
  const lower = normalizeText(content);
  const profile: Partial<UserEligibilityProfile> = {};

  const ageMatch = lower.match(/\b(age|alder|ar)\s*[:=]?\s*(\d{2})\b/i);
  if (ageMatch?.[2]) {
    profile.age = Number.parseInt(ageMatch[2], 10);
  }

  const incomeMatch = lower.match(
    /\b(inkomst|income)\s*[:=]?\s*(\d{3,6})\b/i
  );
  if (incomeMatch?.[2]) {
    profile.monthlyIncomeSek = Number.parseInt(incomeMatch[2], 10);
  }

  if (/(betalningsanmarkning|payment remark|anmarkning)/i.test(lower)) {
    if (/\b(no|nej|none|inga)\b/.test(lower)) {
      profile.paymentRemarks = "no";
    } else if (/\b(yes|ja|har|finns)\b/.test(lower)) {
      profile.paymentRemarks = "yes";
    }
  }

  if (/(kronofogden|debt collection)/i.test(lower)) {
    profile.activeKronofogdenDebt = /(yes|ja|active|aktiv)/i.test(lower);
  }

  const yearsMatch = lower.match(
    /\b(ars boende|years in sweden|resident)\s*[:=]?\s*(\d{1,2})\b/i
  );
  if (yearsMatch?.[2]) {
    profile.yearsInSweden = Number.parseInt(yearsMatch[2], 10);
  }

  if (/(personal loan|privatlan)/i.test(lower)) {
    profile.purpose = "personal-loan";
  } else if (/(business loan|foretagslan)/i.test(lower)) {
    profile.purpose = "business-loan";
  } else if (/(investment|investering)/i.test(lower)) {
    profile.purpose = "investment";
  } else if (/(savings|sparkonto)/i.test(lower)) {
    profile.purpose = "savings";
  } else if (/(pension)/i.test(lower)) {
    profile.purpose = "pension";
  }

  return profile;
}

function buildMandatoryDisclosures(content: string): string[] {
  const disclosures: string[] = [];
  const mentioned = detectMentionedFinanceBrands(content);
  const normalized = normalizeText(content);

  for (const rule of mentioned) {
    if (rule.representativeExampleSv) {
      const sampleTag = normalizeText(rule.representativeExampleSv.slice(0, 24));
      if (!normalized.includes(sampleTag)) {
        disclosures.push(`Representativt exempel (${rule.brand}): ${rule.representativeExampleSv}`);
      }
    }

    if (rule.requiresHighCostWarning && !normalized.includes("⚠")) {
      disclosures.push(HIGH_COST_WARNING_SV);
    }

    if (
      rule.requiresInvestmentWarning &&
      !normalized.includes(normalizeText(FINANCE_INVESTMENT_WARNING_SV))
    ) {
      disclosures.push(FINANCE_INVESTMENT_WARNING_SV);
    }

    if (
      rule.requiresLysaWarning &&
      !normalized.includes(normalizeText(FINANCE_LYSA_WARNING_SV))
    ) {
      disclosures.push(FINANCE_LYSA_WARNING_SV);
    }

    if (
      rule.requiredAffiliateDisclosure &&
      !normalized.includes(normalizeText(FINANCE_AFFILIATE_DISCLOSURE_SV))
    ) {
      disclosures.push(FINANCE_AFFILIATE_DISCLOSURE_SV);
    }

    if (rule.requiresBrokerDisclosure) {
      const brokerDisclosureSv =
        "Tjansten ar en jamforelsetjanst/formedlare och inte en direkt langivare. En kreditupplysning kan delas med flera langivare.";
      if (!normalized.includes(normalizeText(brokerDisclosureSv))) {
        disclosures.push(brokerDisclosureSv);
      }
    }

    if (rule.requiresSponsoredLinkLabel) {
      const lysaSponsoredMarker = "(sponsrad lank)";
      if (!normalized.includes(lysaSponsoredMarker)) {
        disclosures.push(lysaSponsoredMarker);
      }
    }
  }

  return disclosures;
}

export function enforceFinanceAssistantText(
  content: string,
  contextText?: string
): ComplianceEnforcementResult {
  const violations: ComplianceViolation[] = [];
  const injectedDisclosures = buildMandatoryDisclosures(content);
  const mentionedBrands = detectMentionedFinanceBrands(content);

  if (mentionedBrands.length > 0) {
    const inferred = parseEligibilityProfileFromText(contextText ?? content);
    const missing = missingEligibilityFields(inferred);

    if (missing.length > 0) {
      return {
        violations: [
          {
            code: "missing_eligibility_profile",
            severity: "block",
            messageSv: "Behorighetsuppgifter saknas innan varumarkeserbjudanden kan visas.",
            messageEn:
              "Eligibility details are missing before brand offers can be shown.",
            source: "eligibility",
          },
        ],
        blocked: true,
        injectedDisclosures: [],
        text:
          "Innan jag visar ett specifikt finansvarumarke maste jag samla in: alder, manadsinkomst (SEK), betalningsanmarkningar, aktiv skuld hos Kronofogden, antal ar i Sverige och syfte (privatlan/foretagslan/investering/sparande/pension).\n\nBefore I can show a specific finance brand, I need: age, monthly income (SEK), payment remarks, active Kronofogden debt, years resident in Sweden, and purpose (personal loan/business loan/investment/savings/pension).",
      };
    }
  }

  if (/(loan|lan|kredit|credit|apr|ranta|interest)/i.test(content)) {
    violations.push(...findLoanStopWordViolations(content));
  }

  const lower = content.toLowerCase();
  if (lower.includes("reducero") && /\b(bank|banks|banker)\b/i.test(content)) {
    violations.push({
      code: "reducero_lender_wording",
      severity: "block",
      messageSv:
        "For Reducero ska termen langivare anvandas, inte banker.",
      messageEn:
        "For Reducero, use lenders terminology instead of banks.",
      source: "brand-rule",
    });
  }

  if (lower.includes("lysa")) {
    violations.push(...validateInvestmentCopy({ brand: "Lysa", content }));
  }

  if (lower.includes("nordnet")) {
    violations.push(...validateInvestmentCopy({ brand: "Nordnet", content }));
  }

  if (lower.includes("etoro")) {
    violations.push(...validateInvestmentCopy({ brand: "eToro", content }));
  }

  if (violations.length > 0) {
    return {
      violations,
      blocked: true,
      injectedDisclosures: [],
      text:
        "Svarsutkastet stoppades av compliance-regler. Jag kan visa en neutral sammanstallning med obligatoriska risk- och affiliate-disclosures om du vill.\n\nThe draft response was blocked by compliance rules. I can provide a neutral summary with mandatory risk and affiliate disclosures instead.",
    };
  }

  const finalText =
    injectedDisclosures.length > 0
      ? `${content}\n\n${injectedDisclosures.join("\n\n")}`
      : content;

  return {
    violations,
    blocked: false,
    injectedDisclosures,
    text: finalText,
  };
}

export function enforceFinanceComplianceOnAssistantParts(
  parts: unknown,
  contextText?: string
): unknown {
  if (!Array.isArray(parts)) {
    return parts;
  }

  const renderedText = extractTextFromMessageParts(parts);
  if (!renderedText) {
    return parts;
  }

  const result = enforceFinanceAssistantText(renderedText, contextText);

  if (result.text === renderedText) {
    return parts;
  }

  const compliantPart: MessagePart = {
    type: "text",
    text: result.text,
  };

  return [compliantPart];
}
