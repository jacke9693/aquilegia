"use client";

import { ExternalLink } from "lucide-react";
import {
  HIGH_COST_WARNING_SV,
  type FinanceBrandRule,
} from "@/lib/compliance/brands";
import {
  FINANCE_AFFILIATE_DISCLOSURE_SV,
  FINANCE_INVESTMENT_WARNING_SV,
  FINANCE_LYSA_WARNING_SV,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS: Record<
  FinanceBrandRule["category"],
  { sv: string; className: string }
> = {
  loan: {
    sv: "Privatlån",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  "loan-comparison": {
    sv: "Lånjämförelse",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "business-loan": {
    sv: "Företagslån",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  investment: {
    sv: "Investering",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  savings: {
    sv: "Sparande",
    className:
      "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  },
  pawn: {
    sv: "Pantlån",
    className:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
  pension: {
    sv: "Pension",
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  currency: {
    sv: "Valuta",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  tool: {
    sv: "Verktyg",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
  },
};

type AffiliateBrandCardProps = {
  brand: FinanceBrandRule;
  className?: string;
};

export function AffiliateBrandCard({ brand, className }: AffiliateBrandCardProps) {
  const category = CATEGORY_LABELS[brand.category];

  const hasDisclosures =
    brand.requiresHighCostWarning ||
    brand.requiresInvestmentWarning ||
    brand.requiresLysaWarning ||
    brand.requiresBrokerDisclosure ||
    brand.requiredAffiliateDisclosure;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-foreground">
            {brand.brand}
          </span>
          {brand.requiresSponsoredLinkLabel && (
            <span className="text-[10px] italic text-muted-foreground/50">
              (sponsrad)
            </span>
          )}
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            category.className
          )}
        >
          {category.sv}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-3 px-4 py-3">
        {/* Representative example */}
        {brand.representativeExampleSv && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {brand.representativeExampleSv}
          </p>
        )}

        {/* Disclosures */}
        {hasDisclosures && (
          <div className="space-y-1.5 rounded-lg bg-muted/40 px-3 py-2.5">
            {brand.requiresHighCostWarning && (
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {HIGH_COST_WARNING_SV}
              </p>
            )}
            {brand.requiresInvestmentWarning && (
              <p className="text-xs text-muted-foreground">
                {FINANCE_INVESTMENT_WARNING_SV}
              </p>
            )}
            {brand.requiresLysaWarning && (
              <p className="text-xs text-muted-foreground">
                {FINANCE_LYSA_WARNING_SV}
              </p>
            )}
            {brand.requiresBrokerDisclosure && (
              <p className="text-xs text-muted-foreground">
                Tjänsten är en jämförelsetjänst/förmedlare och inte en direkt
                långivare. En kreditupplysning kan delas med flera långivare.
              </p>
            )}
            {brand.requiredAffiliateDisclosure && (
              <p className="text-[11px] italic text-muted-foreground/60">
                {FINANCE_AFFILIATE_DISCLOSURE_SV}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-border/40 px-4 py-3">
        {brand.affiliateUrl ? (
          <a
            href={brand.affiliateUrl}
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            <Button className="w-full" size="sm">
              <ExternalLink className="mr-1.5 size-3.5" />
              Ansök hos {brand.brand}
            </Button>
          </a>
        ) : (
          <Button className="w-full" disabled size="sm" variant="outline">
            Länk ej konfigurerad
          </Button>
        )}
      </div>
    </div>
  );
}
