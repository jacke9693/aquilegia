import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const suggestions = [
  "Jag vill jamfora privatlan i Sverige. Jag ar 31, inkomst 38000 SEK/man, inga betalningsanmarkningar, ingen Kronofogden-skuld, 8 ar i Sverige.",
  "Visa investeringstjanster (inte radgivning) och inkludera alla riskvarningar. Jag bor i Sverige sedan 5 ar.",
  "Jag sokar foretagslan for registrerat bolag. Vilka krav finns pa borgensman och kreditupplysning?",
  "Hjalp mig fylla i behorighetsuppgifter steg for steg: alder, inkomst, anmarkningar, Kronofogden, boendetid, syfte.",
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
  "Lanken nedan ar en affiliatelank - vi kan fa ersattning om du ansoker.";
export const FINANCE_AFFILIATE_DISCLOSURE_EN =
  "The link below is an affiliate link - we may receive compensation if you apply.";

export const FINANCE_INVESTMENT_WARNING_SV =
  "Historisk avkastning ar ingen garanti for framtida avkastning. Det finns en risk att du inte far tillbaka det kapital du investerade.";
export const FINANCE_INVESTMENT_WARNING_EN =
  "Historical returns are no guarantee of future returns. There is a risk that you may not get back the money you invested.";

export const FINANCE_LYSA_WARNING_SV =
  "Investeringar i vardepapper och fonder innebar alltid en risk. En investering kan bade oka och minska i varde och det ar inte sakert att du far tillbaka det investerade kapitalet.";

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
