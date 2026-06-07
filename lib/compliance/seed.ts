import type { FinanceBrandRule } from "@/lib/compliance/brands";
import { getFinanceComplianceTemplate } from "@/lib/compliance/template";
import type {
  FinanceApproval,
  FinanceBrandRule as FinanceBrandRuleRow,
} from "@/lib/db/schema";

export type FinanceDbSeedPayload = {
  templateVersion: string;
  market: "SE";
  brands: Array<
    Pick<
      FinanceBrandRuleRow,
      | "brand"
      | "category"
      | "representativeExampleSv"
      | "requiresHighCostWarning"
      | "requiresInvestmentWarning"
      | "requiresLysaWarning"
      | "forbidCrypto"
      | "requiredAffiliateDisclosure"
    >
  >;
  approvals: Array<
    Pick<
      FinanceApproval,
      "brand" | "approvalType" | "status" | "notes" | "approvedBy"
    >
  >;
};

function toBrandRow(brand: FinanceBrandRule): FinanceDbSeedPayload["brands"][number] {
  return {
    brand: brand.brand,
    category: brand.category,
    representativeExampleSv: brand.representativeExampleSv ?? null,
    requiresHighCostWarning: brand.requiresHighCostWarning ?? false,
    requiresInvestmentWarning: brand.requiresInvestmentWarning ?? false,
    requiresLysaWarning: brand.requiresLysaWarning ?? false,
    forbidCrypto: brand.forbidCrypto ?? false,
    requiredAffiliateDisclosure: brand.requiredAffiliateDisclosure ?? true,
  };
}

function toApprovalRows(brand: FinanceBrandRule): FinanceDbSeedPayload["approvals"][number][] {
  const rows: FinanceDbSeedPayload["approvals"][number][] = [];

  if (brand.requiresBrokerDisclosure || brand.requiredAffiliateDisclosure) {
    rows.push({
      brand: brand.brand,
      approvalType: "content",
      status: "pending",
      notes: "Template seed: requires manual verification before publication.",
      approvedBy: null,
    });
  }

  if (brand.requiresSponsoredLinkLabel) {
    rows.push({
      brand: brand.brand,
      approvalType: "manual",
      status: "pending",
      notes: "Template seed: sponsored-link label required.",
      approvedBy: null,
    });
  }

  return rows;
}

export function buildFinanceDbSeedPayload(): FinanceDbSeedPayload {
  const template = getFinanceComplianceTemplate();

  return {
    templateVersion: template.version,
    market: template.market,
    brands: template.brands.map(toBrandRow),
    approvals: template.brands.flatMap(toApprovalRows),
  };
}

export function buildFinanceBrandSeedRows() {
  return buildFinanceDbSeedPayload().brands;
}

export function buildFinanceApprovalSeedRows() {
  return buildFinanceDbSeedPayload().approvals;
}