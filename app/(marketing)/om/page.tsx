import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om tjänsten",
  description:
    "Om Finansassistenten — AI-driven jämförelsetjänst för svenska lån, investeringar och sparkonton.",
};

export default function OmPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Om Finansassistenten</h1>

      <h2>Vad är Finansassistenten?</h2>
      <p>
        Finansassistenten är en AI-driven jämförelsetjänst för svenska
        finansprodukter. Vi hjälper privatpersoner att hitta rätt privatlån,
        sparkonto, investering och pensionssparande — utan att behöva besöka
        tio olika sajter.
      </p>
      <p>
        Tjänsten är <strong>inte</strong> en licensierad finansiell rådgivare.
        Alla svar är informativa och compliance-kontrollerade, men du bör alltid
        verifiera villkor och söka personlig rådgivning hos en auktoriserad
        aktör innan du fattar ekonomiska beslut.
      </p>

      <h2>Hur tjänar ni pengar?</h2>
      <p>
        Finansassistenten är gratis för slutanvändare. Vi finansieras via
        affiliateersättning — om du klickar på en produktlänk märkt{" "}
        <strong>ANNONS</strong> och ansöker om produkten kan vi erhålla
        ersättning från den finansiella aktören via affiliatenätverk som
        Adtraction.
      </p>
      <p>
        Denna ersättning påverkar <strong>inte</strong> vilka produkter som
        visas eller i vilken ordning. Produkter filtreras uteslutande utifrån
        din behörighetsprofil och inbyggda compliance-regler baserade på
        Konsumentverkets och FI:s riktlinjer.
      </p>

      <h2>Inbyggd compliance</h2>
      <p>
        Alla AI-svar passerar automatiska compliance-kontroller innan de visas:
      </p>
      <ul>
        <li>
          Obligatoriska varningar för höga kreditkostnader (effektiv ränta
          {" > "}24,99 %) visas alltid.
        </li>
        <li>
          Investeringsvarningar ("historisk avkastning är ingen garanti...")
          visas för alla investeringsprodukter.
        </li>
        <li>
          Representativa exempel med APR och totalkostnad visas för alla
          kreditprodukter i enlighet med konsumentkreditlagen.
        </li>
        <li>
          Alla affiliateannonser är tydligt märkta med <strong>ANNONS</strong>{" "}
          enligt ICC:s regler och Konsumentverkets riktlinjer.
        </li>
      </ul>

      <h2>Redaktionell policy</h2>
      <p>
        Finansassistenten presenterar bara produkter från aktörer som är
        reglerade av Finansinspektionen (FI) eller motsvarande europeisk
        tillsynsmyndighet. Vi utvärderar löpande vilka aktörer som inkluderas
        och tar bort aktörer som bryter mot tillämpliga regler.
      </p>
      <p>
        AI-modellen instrueras aktivt att <em>inte</em> rekommendera produkter
        till användare som inte uppfyller grundläggande krav (ålder, inkomst,
        skuldsituation). Svar som innehåller vilseledande finansiell information
        blockeras automatiskt.
      </p>

      <h2>Dataskydd</h2>
      <p>
        Vi samlar in minimalt med personuppgifter och delar aldrig din
        behörighetsprofil med finansföretagen. Läs mer i vår{" "}
        <a href="/integritetspolicy">Integritetspolicy</a>.
      </p>

      <h2>Kontakt</h2>
      <p>
        Har du frågor, synpunkter eller vill rapportera felaktig information?
        Kontakta oss på{" "}
        <strong>kontakt@finansassistenten.se</strong>.
      </p>
      <p>
        För juridiska frågor:{" "}
        <strong>legal@finansassistenten.se</strong>
        <br />
        För dataskyddsfrågor:{" "}
        <strong>privacy@finansassistenten.se</strong>
      </p>
    </article>
  );
}
