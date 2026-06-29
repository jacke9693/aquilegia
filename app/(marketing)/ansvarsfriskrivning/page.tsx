import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ansvarsfriskrivning",
  description:
    "Information om Finansassistentens roll som jämförelsetjänst, affiliaterelationer och begränsningar.",
};

export default function AnsvarsfriskrivningPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Ansvarsfriskrivning</h1>
      <p className="lead text-muted-foreground">
        Senast uppdaterad: 29 juni 2026
      </p>

      <h2>1. Tjänstens natur — vi är inte en finansiell rådgivare</h2>
      <p>
        Finansassistenten är en <strong>jämförelsetjänst</strong>, inte en
        licensierad finansiell rådgivare. Inget i tjänsten utgör personlig
        finansiell, juridisk eller skattemässig rådgivning. Du bör alltid
        konsultera en auktoriserad rådgivare eller direkt kontakta det
        finansiella institutet innan du fattar ekonomiska beslut.
      </p>
      <p>
        Tjänsten är inte tillståndspliktig enligt lag (2004:46) om
        värdepappersfonder eller lag (2007:528) om värdepappersmarknaden och
        bedriver inte förmedling eller rådgivning i lagens mening.
      </p>

      <h2>2. Affiliaterelationer och kommersiella intressen</h2>
      <p>
        Finansassistenten samarbetar med finansiella aktörer via
        affiliateprogram (bl.a. Adtraction). Det innebär att vi kan erhålla
        ersättning när en användare klickar på en länk och/eller ansöker om en
        produkt.
      </p>
      <ul>
        <li>
          Alla affiliateannonser är tydligt märkta med <strong>ANNONS</strong>{" "}
          i enlighet med ICC:s regler och Konsumentverkets riktlinjer.
        </li>
        <li>
          Ersättning från affiliateprogram påverkar <strong>inte</strong>{" "}
          rangordningen eller vilka produkter som presenteras — dessa bestäms
          uteslutande av ditt behörighetsprofil och inbyggda compliance-regler.
        </li>
        <li>
          Produkter visas bara om du uppfyller de grundläggande kraven (ålder,
          inkomst, skuldsituation m.m.) som respektive aktör ställer.
        </li>
      </ul>

      <h2>3. Representativa exempel</h2>
      <p>
        Representativa exempel som visas i tjänsten (räntor, löptider, totala
        kostnader) är hämtade från respektive aktörs offentliga information och
        baseras på ett typiskt kundexempel. Det faktiska erbjudandet du erhåller
        kan avvika beroende på din kreditvärdighet, säkerhet och aktuella
        marknadsräntor.
      </p>

      <h2>4. Investeringsvarning</h2>
      <p>
        Historisk avkastning är ingen garanti för framtida avkastning.
        Investeringar i aktier, fonder och andra finansiella instrument
        innebär alltid risk. Värdet på din investering kan sjunka och du kan
        förlora hela eller delar av det investerade beloppet.
      </p>

      <h2>5. Höga kreditkostnader</h2>
      <p>
        För krediter med effektiv årsränta överstigande 24,99 % visas en
        tydlig varning i enlighet med Konsumentverkets riktlinjer. Vi
        rekommenderar att noga läsa villkoren och beräkna totalkostnaden
        innan du ansöker om sådan kredit.
      </p>

      <h2>6. Noggrannhet och aktualitet</h2>
      <p>
        Vi strävar efter att hålla information om produkter, räntor och villkor
        aktuell, men kan inte garantera att informationen är fullständig eller
        felfri vid alla tidpunkter. Verifiera alltid aktuella villkor direkt
        hos respektive aktör.
      </p>

      <h2>7. Ansvarsbegränsning</h2>
      <p>
        Finansassistenten ansvarar inte för förlust eller skada som uppstår
        till följd av beslut fattade på basis av information i tjänsten.
        Användaren bär fullt ansvar för sina egna ekonomiska beslut.
      </p>

      <h2>8. Tillämplig lag och tvistelösning</h2>
      <p>
        Dessa villkor regleras av svensk rätt. Tvister avgörs i allmän domstol
        med Stockholms tingsrätt som första instans, eller via Allmänna
        reklamationsnämnden (ARN) för konsumenttvister.
      </p>

      <h2>9. Kontakt</h2>
      <p>
        Frågor om denna ansvarsfriskrivning skickas till{" "}
        <strong>legal@finansassistenten.se</strong>.
      </p>
    </article>
  );
}
