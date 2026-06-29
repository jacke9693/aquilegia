import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Hur Finansassistenten samlar in, använder och skyddar dina personuppgifter enligt GDPR.",
};

export default function IntegritetspolicyPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Integritetspolicy</h1>
      <p className="lead text-muted-foreground">
        Senast uppdaterad: 29 juni 2026
      </p>

      <h2>1. Personuppgiftsansvarig</h2>
      <p>
        Finansassistenten driver denna tjänst. Kontakta oss vid frågor om
        personuppgifter: <strong>privacy@finansassistenten.se</strong>
      </p>

      <h2>2. Vilka uppgifter samlar vi in?</h2>
      <ul>
        <li>
          <strong>Kontouppgifter</strong> — e-postadress och hashat lösenord vid
          registrering.
        </li>
        <li>
          <strong>Behörighetsuppgifter</strong> — ålder, månadsinkomst,
          betalningsanmärkningar, skuld hos Kronofogden, antal år i Sverige och
          syfte. Dessa lagras krypterat och används uteslutande för att filtrera
          finansprodukter som passar din situation.
        </li>
        <li>
          <strong>Chatthistorik</strong> — dina meddelanden och assistentens
          svar, kopplade till ditt konto, för att möjliggöra historik och
          förbättringar av tjänsten.
        </li>
        <li>
          <strong>Tekniska loggar</strong> — IP-adress, webbläsartyp och
          tidsstämplar för säkerhets- och felsökningsändamål.
        </li>
      </ul>

      <h2>3. Rättslig grund för behandlingen</h2>
      <p>
        Vi behandlar dina personuppgifter med stöd av följande rättsliga
        grunder:
      </p>
      <ul>
        <li>
          <strong>Avtal (art. 6.1.b GDPR)</strong> — uppgifter som är
          nödvändiga för att tillhandahålla tjänsten (konto, chat, profil).
        </li>
        <li>
          <strong>Berättigat intresse (art. 6.1.f GDPR)</strong> — tekniska
          loggar för säkerhet och drift.
        </li>
        <li>
          <strong>Samtycke (art. 6.1.a GDPR)</strong> — spårningscookies och
          affiliate-spårning, som du kan återkalla när som helst.
        </li>
      </ul>

      <h2>4. Hur länge sparas uppgifterna?</h2>
      <ul>
        <li>Kontouppgifter: tills du raderar ditt konto.</li>
        <li>Chatthistorik: 12 månader eller tills du raderar den manuellt.</li>
        <li>Behörighetsuppgifter: tills du ändrar eller raderar dem.</li>
        <li>Tekniska loggar: 90 dagar.</li>
      </ul>

      <h2>5. Delning med tredje part</h2>
      <p>
        Vi delar <strong>aldrig</strong> dina personuppgifter med
        finansföretagen som presenteras i tjänsten. Datan som delas är begränsad
        till:
      </p>
      <ul>
        <li>
          <strong>Affiliatenätverk (t.ex. Adtraction)</strong> — ett
          anonymiserat klick-ID registreras när du klickar på en affiliatelänk.
          Inga personuppgifter skickas.
        </li>
        <li>
          <strong>Infrastrukturleverantörer</strong> — Vercel (hosting), Neon
          (databas), OpenAI (AI). Dessa behandlar data i enlighet med sina egna
          GDPR-avtal (DPA).
        </li>
      </ul>

      <h2>6. Dina rättigheter</h2>
      <p>Du har rätt att:</p>
      <ul>
        <li>Begära tillgång till dina personuppgifter (art. 15).</li>
        <li>Begära rättelse av felaktiga uppgifter (art. 16).</li>
        <li>Begära radering ("rätten att bli glömd") (art. 17).</li>
        <li>Invända mot behandlingen (art. 21).</li>
        <li>Begära dataportabilitet (art. 20).</li>
        <li>Lämna klagomål till Integritetsskyddsmyndigheten (IMY).</li>
      </ul>
      <p>
        Skicka din begäran till{" "}
        <strong>privacy@finansassistenten.se</strong>. Vi svarar inom 30 dagar.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Vi använder nödvändiga sessionskakor för inloggning. Frivilliga
        spårningscookies (affiliate) aktiveras bara med ditt samtycke via
        cookie-bannern.
      </p>

      <h2>8. Ändringar</h2>
      <p>
        Vi meddelar dig via e-post om väsentliga förändringar i denna policy.
        Den senaste versionen finns alltid på den här sidan.
      </p>
    </article>
  );
}
