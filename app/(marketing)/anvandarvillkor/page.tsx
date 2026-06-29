import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Användarvillkor",
  description:
    "Villkor för användning av Finansassistenten — jämförelsetjänst för svenska finansprodukter.",
};

export default function AnvandarvillkorPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Användarvillkor</h1>
      <p className="lead text-muted-foreground">
        Senast uppdaterad: 29 juni 2026
      </p>

      <h2>1. Om tjänsten</h2>
      <p>
        Finansassistenten ("<strong>tjänsten</strong>") är en AI-driven
        jämförelsetjänst för svenska finansprodukter — lån, sparkonton,
        investeringar och pensionssparande. Tjänsten tillhandahålls kostnadsfritt
        för slutanvändare och finansieras via affiliateersättning från
        finansiella aktörer.
      </p>
      <p>
        Tjänsten är <strong>inte</strong> en licensierad finansiell rådgivare
        och lämnar inte personliga råd i lagens mening. Se vår{" "}
        <a href="/ansvarsfriskrivning">Ansvarsfriskrivning</a> för mer
        information.
      </p>

      <h2>2. Konto och säkerhet</h2>
      <ul>
        <li>Du måste vara minst 18 år för att skapa ett konto.</li>
        <li>
          Du ansvarar för att hålla ditt lösenord konfidentiellt och för all
          aktivitet som sker via ditt konto.
        </li>
        <li>
          Kontakta oss omedelbart på{" "}
          <strong>support@finansassistenten.se</strong> om du misstänker
          obehörig åtkomst.
        </li>
        <li>
          Vi förbehåller oss rätten att stänga av konton som missbrukas,
          skapar falsk information eller används i automatiserade attacker.
        </li>
      </ul>

      <h2>3. Tillåten användning</h2>
      <p>Du får använda tjänsten för personliga, icke-kommersiella ändamål.</p>
      <p>Du får <strong>inte</strong>:</p>
      <ul>
        <li>
          Använda tjänsten för att systematiskt skrapa, kopiera eller
          vidaresälja innehåll.
        </li>
        <li>
          Försöka kringgå compliance-regler, säkerhetssystem eller
          autentisering.
        </li>
        <li>
          Använda tjänsten i syfte att sprida vilseledande finansiell
          information.
        </li>
        <li>
          Skicka automatiserade förfrågningar (bots) utan skriftligt
          godkännande.
        </li>
      </ul>

      <h2>4. AI-genererat innehåll</h2>
      <p>
        Tjänsten använder stora språkmodeller (LLM) för att generera svar.
        Trots inbyggda compliance-kontroller kan AI-genererat innehåll
        innehålla fel eller vara inaktuellt. Du bör alltid verifiera viktig
        finansiell information direkt hos respektive aktör eller en auktoriserad
        rådgivare innan du fattar beslut.
      </p>

      <h2>5. Affiliatelänkar och kommersiella intressen</h2>
      <p>
        Tjänsten innehåller affiliatelänkar märkta med <strong>ANNONS</strong>.
        Om du klickar på en länk och ingår avtal med en finansiell aktör kan vi
        erhålla ersättning. Denna ersättning påverkar inte vilka produkter som
        visas eller i vilken ordning — det avgörs uteslutande av din
        behörighetsprofil och compliance-regler.
      </p>

      <h2>6. Immateriella rättigheter</h2>
      <p>
        Allt innehåll, design och kod i tjänsten tillhör Finansassistenten eller
        dess licensgivare. Du får inte reproducera, distribuera eller skapa
        härledda verk utan skriftligt tillstånd.
      </p>

      <h2>7. Tillgänglighet och ändringar</h2>
      <p>
        Vi strävar efter hög drifttid men garanterar inte oavbruten tillgång.
        Vi förbehåller oss rätten att ändra, pausa eller avveckla delar av
        tjänsten med skälig varsel.
      </p>
      <p>
        Väsentliga ändringar av dessa villkor meddelas via e-post minst 14
        dagar i förväg. Fortsatt användning av tjänsten efter ikraftträdandet
        innebär att du godtar de nya villkoren.
      </p>

      <h2>8. Ansvarsbegränsning</h2>
      <p>
        Tjänsten tillhandahålls "i befintligt skick". Finansassistenten ansvarar
        inte för direkta eller indirekta förluster till följd av användning av
        tjänsten, inklusive ekonomiska beslut fattade på basis av AI-genererade
        svar.
      </p>

      <h2>9. Tillämplig lag</h2>
      <p>
        Dessa villkor regleras av svensk rätt. Tvister avgörs i allmän domstol
        med Stockholms tingsrätt som första instans, eller via Allmänna
        reklamationsnämnden (ARN) för konsumenttvister.
      </p>

      <h2>10. Kontakt</h2>
      <p>
        Frågor om dessa villkor skickas till{" "}
        <strong>legal@finansassistenten.se</strong>.
      </p>
    </article>
  );
}
