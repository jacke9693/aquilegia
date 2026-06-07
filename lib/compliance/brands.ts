export type FinanceBrandRule = {
  brand: string;
  aliases?: string[];
  category:
    | "loan"
    | "loan-comparison"
    | "business-loan"
    | "investment"
    | "savings"
    | "pawn"
    | "pension"
    | "currency"
    | "tool";
  /** Adtraction or direct affiliate tracking URL — replace with live tracking link. */
  affiliateUrl?: string;
  representativeExampleSv?: string;
  requiresInvestmentWarning?: boolean;
  requiresLysaWarning?: boolean;
  forbidCrypto?: boolean;
  requiresHighCostWarning?: boolean;
  requiredAffiliateDisclosure?: boolean;
  requiresBrokerDisclosure?: boolean;
  requiresLenderTerminology?: boolean;
  requiresSponsoredLinkLabel?: boolean;
};

export const HIGH_COST_WARNING_SV =
  "⚠ Varning for hoga kreditkostnader.";

export const SWEDEN_FINANCE_BRAND_RULES: FinanceBrandRule[] = [
  {
    brand: "Bank Norwegian",
    aliases: ["banknorwegian"],
    category: "loan",
    representativeExampleSv:
      "Vid ett privatlan pa 135 000 kr som aterbetalas pa 10 ar med rantan 10,49% blir den effektiva rantan 11,36%. Totalt belopp: 221 430 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Northmill Bank Bolan",
    aliases: ["northmill bolan", "northmill bank"],
    category: "loan",
    representativeExampleSv:
      "Lan pa 1 200 000 kr, 30-ars lopttid, 6,95% rorlig ranta ger 7,23% effektiv ranta. Totalt belopp: 2 461 425 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Northmill Bank Debetkort",
    aliases: ["northmill debetkort", "northmill pay later"],
    category: "loan",
    representativeExampleSv:
      "For en kredit pa 10 000 kr med 12 manaders aterbetalning ar den effektiva rantan 24,24%. Totalt belopp: 11 226 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Northmill Bank Foretagslan",
    aliases: ["northmill foretagslan"],
    category: "business-loan",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Kredio",
    category: "loan",
    representativeExampleSv:
      "Ett lan pa 25 000 kr till 21,95% rorlig ranta med 12 manaders aterbetalning ger en effektiv arsranta pa 24,3%.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Credifi",
    category: "loan",
    representativeExampleSv:
      "En kredit pa 20 000 kr med 22% ranta over 15 manader ger en effektiv ranta pa 66,01%. Totalt belopp: 26 939 kr.",
    requiresHighCostWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Fairlo",
    category: "loan",
    representativeExampleSv:
      "Lan pa 40 000 kr, 22% rorlig ranta, 72 manaders lopttid ger en effektiv ranta pa 28,18%. Totalt belopp: 77 199 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Brixo Privatlan",
    aliases: ["brixo"],
    category: "loan",
    representativeExampleSv:
      "En kredit pa 75 000 kr over 90 manader med 19,95% ranta ger en effektiv arsranta pa 22,8%.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Collector Bank",
    aliases: ["collector"],
    category: "loan",
    representativeExampleSv:
      "Kreditbelopp om 105 000 kr, 12 ars lopttid, 9,39% ranta ger en effektiv ranta pa 9,80%. Totalt belopp: 175 407 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Get Dreams",
    aliases: ["dreams"],
    category: "loan",
    representativeExampleSv:
      "Lan pa 100 000 kr, 10 ars lopttid, 8% ranta. Manadskostnad: 1 213 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Banky",
    category: "loan",
    representativeExampleSv:
      "Annuitetslan 5 ar, 60 000 kr ger en effektiv arsranta pa 26,5%. Manadskostnad: 1 709 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "CreditStar.se",
    aliases: ["creditstar"],
    category: "loan",
    representativeExampleSv:
      "Lan pa 30 000 kr, 20% ranta, over 60 manader ger en effektiv ranta pa 25,06%. Totalt belopp: 49 788,84 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Enkelfinans",
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan 12 ar, belopp 400 000 kr, rorlig ranta 7,99% ger en effektiv ranta pa 8,41%. Totalt belopp: 626 457 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Loans.se",
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan 12 ar, belopp 400 000 kr, rorlig ranta 7,99% ger en effektiv ranta pa 8,41%. Totalt belopp: 626 457 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Ekonomen",
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan 12 ar, belopp 400 000 kr, rorlig ranta 7,99% ger en effektiv ranta pa 8,41%. Totalt belopp: 626 457 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Finlo.se",
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan 12 ar, belopp 400 000 kr, rorlig ranta 7,99% ger en effektiv ranta pa 8,41%. Totalt belopp: 626 457 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Compari.se",
    aliases: ["compari"],
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan pa 150 000 kr, 12 ars lopttid, 6,4% ranta ger en effektiv ranta pa 6,59%.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Trygga",
    category: "loan-comparison",
    representativeExampleSv:
      "Lan pa 100 000 kr, 12 ars aterbetalningstid, 8,3% ranta ger en effektiv ranta pa 8,73%. Totalt belopp: 158 252 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Natfinans",
    aliases: ["natfinans", "nat finans"],
    category: "loan-comparison",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "AXO Finans",
    aliases: ["axo"],
    category: "loan-comparison",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Advisa",
    category: "loan-comparison",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Myloan24 SE",
    aliases: ["myloan24"],
    category: "loan-comparison",
    representativeExampleSv:
      "Kreditbelopp 150 000 kr, 10 ars lopttid, ger en effektiv arsranta pa 6,59%. Totalt belopp: 203 472 kr.",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Sambla",
    category: "loan-comparison",
    requiresBrokerDisclosure: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Ekomni",
    category: "loan",
    representativeExampleSv:
      "Godkant belopp 4 500 kr, 6 manaders aterbetalningstid, 22% ranta ger en effektiv ranta pa 154,36%. Totalt belopp: 5 207,12 kr.",
    requiresHighCostWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Saldo Bank",
    category: "loan",
    representativeExampleSv:
      "En utnyttjad kredit pa 5 000 SEK, med 12 amorteringar, ger en effektiv ranta pa 92,07%. Totalt belopp: 6 996,48 kr.",
    requiresHighCostWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Binly",
    category: "loan",
    representativeExampleSv:
      "Lan pa 14 000 kr med 10 manaders aterbetalning ger en effektiv ranta pa 78,26%. Totalt belopp: 18 517 kr.",
    requiresHighCostWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Tomly",
    category: "loan",
    representativeExampleSv:
      "Lan pa 14 000 kr med 10 manaders aterbetalning ger en effektiv ranta pa 78,26%. Totalt belopp: 18 517 kr.",
    requiresHighCostWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Reducero",
    category: "loan-comparison",
    representativeExampleSv:
      "Annuitetslan pa 300 000 kr med lopttid 12 ar, 6,94% ranta ger en effektiv ranta pa 7,17%. Totalt belopp: 442 878 kr.",
    requiresBrokerDisclosure: true,
    requiresLenderTerminology: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Nordnet",
    category: "investment",
    requiresInvestmentWarning: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Lysa",
    category: "investment",
    requiresInvestmentWarning: true,
    requiresLysaWarning: true,
    requiresSponsoredLinkLabel: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "eToro",
    category: "investment",
    requiresInvestmentWarning: true,
    forbidCrypto: true,
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Multitude Bank",
    category: "savings",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Pantlan",
    aliases: ["pantlan"],
    category: "pawn",
    representativeExampleSv:
      "Lan pa 50 000 kr for 12 manader med 2,58% manadsranta ger en effektiv ranta pa ca 34%. Totalt belopp: 66 989 kr.",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Pensionera",
    category: "pension",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Changegroup SE",
    aliases: ["changegroup"],
    category: "currency",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "uScore",
    aliases: ["uscore"],
    category: "tool",
    requiredAffiliateDisclosure: true,
  },
  {
    brand: "Pamind",
    aliases: ["pamind", "pamind app"],
    category: "tool",
    requiredAffiliateDisclosure: true,
  },
];

export function detectMentionedFinanceBrands(content: string): FinanceBrandRule[] {
  const lower = content.toLowerCase();
  return SWEDEN_FINANCE_BRAND_RULES.filter((rule) => {
    const names = [rule.brand, ...(rule.aliases ?? [])];
    return names.some((name) => lower.includes(name.toLowerCase()));
  });
}
