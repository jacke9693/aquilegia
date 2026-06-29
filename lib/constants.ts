import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const DUMMY_PASSWORD = generateDummyPassword();

export const suggestions = [
  "Jag vill jämföra privatlån i Sverige. Jag är 31 år, inkomst 38 000 SEK/mån, inga betalningsanmärkningar, ingen Kronofogden-skuld, bott i Sverige 8 år.",
  "Visa investeringstjänster (ej rådgivning) och inkludera alla riskvarningar. Jag bor i Sverige sedan 5 år.",
  "Jag söker företagslån för registrerat bolag. Vilka krav ställs på borgensman och kreditupplysning?",
  "Hjälp mig fylla i behörighetsuppgifter steg för steg: ålder, inkomst, anmärkningar, Kronofogden, boendetid, syfte.",
];

export const FINANCE_DEFAULT_LOCALE = "sv-SE";
export const FINANCE_FALLBACK_LOCALE = "en";

export const FINANCE_REQUIRED_ELIGIBILITY_FIELDS = [
  "age",
  "monthlyIncomeSek",
  "paymentRemarks",
  "activeKronofogdenDebt",
  "yearsInSweden",
  "purpose",
] as const;

export const FINANCE_PURPOSES = [
  "personal-loan",
  "business-loan",
  "investment",
  "savings",
  "pension",
] as const;

export const FINANCE_HIGH_COST_APR_THRESHOLD = 50;

export const FINANCE_AFFILIATE_DISCLOSURE_SV =
  "Länken nedan är en affiliatelänk – vi kan få ersättning om du ansöker.";
export const FINANCE_AFFILIATE_DISCLOSURE_EN =
  "The link below is an affiliate link - we may receive compensation if you apply.";

export const FINANCE_INVESTMENT_WARNING_SV =
  "Historisk avkastning är ingen garanti för framtida avkastning. Det finns en risk att du inte får tillbaka det kapital du investerade.";
export const FINANCE_INVESTMENT_WARNING_EN =
  "Historical returns are no guarantee of future returns. There is a risk that you may not get back the money you invested.";

export const FINANCE_LYSA_WARNING_SV =
  "Investeringar i värdepapper och fonder innebär alltid en risk. En investering kan både öka och minska i värde och det är inte säkert att du får tillbaka det investerade kapitalet.";

export const FINANCE_LOAN_STOP_WORDS = [
  "snabbt",
  "quick",
  "quickly",
  "enkelt",
  "easy",
  "easily",
  "problemfritt",
  "trouble-free",
  "garanterat",
  "guaranteed",
] as const;

export const FINANCE_HIGH_COST_BRANDS = [
  "Ekomni",
  "Binly",
  "Tomly",
  "Saldo Bank",
  "Credifi",
] as const;

export const FINANCE_INVESTMENT_BRANDS = ["Nordnet", "Lysa", "eToro"] as const;

export const FINANCE_ETORO_FORBIDDEN_TOPICS = ["crypto", "cryptocurrency"] as const;
