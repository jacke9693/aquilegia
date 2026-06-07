import {
  FINANCE_AFFILIATE_DISCLOSURE_EN,
  FINANCE_AFFILIATE_DISCLOSURE_SV,
  FINANCE_DEFAULT_LOCALE,
  FINANCE_FALLBACK_LOCALE,
  FINANCE_HIGH_COST_APR_THRESHOLD,
  FINANCE_INVESTMENT_WARNING_EN,
  FINANCE_INVESTMENT_WARNING_SV,
  FINANCE_LYSA_WARNING_SV,
  FINANCE_REQUIRED_ELIGIBILITY_FIELDS,
} from "@/lib/constants";
import {
  HIGH_COST_WARNING_SV,
  SWEDEN_FINANCE_BRAND_RULES,
  type FinanceBrandRule,
} from "@/lib/compliance/brands";

export type FinanceComplianceTemplate = {
  version: string;
  market: "SE";
  locale: string;
  fallbackLocale: string;
  updatedAt: string;
  policy: {
    highCostAprThreshold: number;
    requiredEligibilityFields: readonly string[];
    affiliateDisclosure: {
      sv: string;
      en: string;
    };
    investmentWarning: {
      sv: string;
      en: string;
      lysaSv: string;
    };
    highCostWarningSv: string;
  };
  brands: FinanceBrandRule[];
};

export const FINANCE_COMPLIANCE_TEMPLATE: FinanceComplianceTemplate = {
  version: "2026-06-07-template-v1",
  market: "SE",
  locale: FINANCE_DEFAULT_LOCALE,
  fallbackLocale: FINANCE_FALLBACK_LOCALE,
  updatedAt: new Date().toISOString(),
  policy: {
    highCostAprThreshold: FINANCE_HIGH_COST_APR_THRESHOLD,
    requiredEligibilityFields: FINANCE_REQUIRED_ELIGIBILITY_FIELDS,
    affiliateDisclosure: {
      sv: FINANCE_AFFILIATE_DISCLOSURE_SV,
      en: FINANCE_AFFILIATE_DISCLOSURE_EN,
    },
    investmentWarning: {
      sv: FINANCE_INVESTMENT_WARNING_SV,
      en: FINANCE_INVESTMENT_WARNING_EN,
      lysaSv: FINANCE_LYSA_WARNING_SV,
    },
    highCostWarningSv: HIGH_COST_WARNING_SV,
  },
  brands: SWEDEN_FINANCE_BRAND_RULES,
};

export function getFinanceComplianceTemplate() {
  return FINANCE_COMPLIANCE_TEMPLATE;
}

export function getFinanceBrandTemplate(brandName: string) {
  const lower = brandName.toLowerCase();
  return FINANCE_COMPLIANCE_TEMPLATE.brands.find((brand) => {
    const names = [brand.brand, ...(brand.aliases ?? [])];
    return names.some((name) => name.toLowerCase() === lower);
  });
}

export function listFinanceBrandTemplates() {
  return FINANCE_COMPLIANCE_TEMPLATE.brands.slice();
}

export function buildFinanceDbSeedPayload() {
  return {
    templateVersion: FINANCE_COMPLIANCE_TEMPLATE.version,
    market: FINANCE_COMPLIANCE_TEMPLATE.market,
    policy: FINANCE_COMPLIANCE_TEMPLATE.policy,
    brands: FINANCE_COMPLIANCE_TEMPLATE.brands,
  };
}