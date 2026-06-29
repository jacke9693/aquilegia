"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Sparkles, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-driven jämförelse",
    body: "Berätta om dina behov — assistenten matchar dig med rätt lån, sparkonto eller investering bland svenska reglerade aktörer.",
  },
  {
    icon: Shield,
    title: "Compliance-first",
    body: "Alla svar kontrolleras mot Konsumentverket- och FI-regler. Varningar och disclosures visas automatiskt, alltid.",
  },
  {
    icon: Zap,
    title: "Spara tid",
    body: "Istället för att besöka tio olika sajter ger du dina uppgifter en gång och får matchade förslag direkt i chatten.",
  },
];

const STEPS = [
  { num: "1", title: "Berätta om dig", body: "Ange ålder, inkomst, syfte och om du har betalningsanmärkningar — tar under en minut." },
  { num: "2", title: "AI jämför åt dig", body: "Assistenten filtrerar bland svenska lån, investeringar och sparkonton och väljer bort produkter du inte uppfyller kraven för." },
  { num: "3", title: "Välj och ansök", body: "Klicka på det erbjudande som passar dig — du ser representativt exempel och alla obligatoriska disclosures innan du går vidare." },
];

const BRANDS = [
  "Lendo", "Lysa", "Avanza", "Sambla", "Zmarta", "Northmill", "Klarna", "Swedbank",
];

export function LandingPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-md">
        <span className="font-semibold text-base tracking-tight">
          Finansassistenten
        </span>
        <div className="flex items-center gap-3">
          <Link
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="/login"
          >
            Logga in
          </Link>
          <Link
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/register"
          >
            Kom igång gratis
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-[12px] text-muted-foreground">
            <Shield className="size-3" />
            Compliance-granskad — alltid
          </div>
          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Jämför lån &amp; investeringar
            <br />
            <span className="text-primary">med AI</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            Finansassistenten matchar dig med reglerade svenska finansprodukter —
            med inbyggd compliance, fullständiga disclosures och inga dolda
            intressen.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
              href="/register"
            >
              Starta gratis
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              href="/login"
            >
              Logga in
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground/60">
            Gratis att använda · Inget kreditkort krävs · GDPR-säkert
          </p>
        </section>

        {/* Brand strip */}
        <section className="border-y border-border/40 bg-muted/30 py-5">
          <div className="mx-auto max-w-4xl px-6">
            <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Jämför bland
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {BRANDS.map((b) => (
                <span
                  className="text-sm font-semibold text-muted-foreground/70"
                  key={b}
                >
                  {b}
                </span>
              ))}
              <span className="text-sm text-muted-foreground/50">+ fler</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">
            Varför Finansassistenten?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                className="rounded-xl border border-border/50 bg-card p-5 shadow-sm"
                key={title}
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold text-sm">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">
              Så här fungerar det
            </h2>
            <div className="space-y-6">
              {STEPS.map(({ num, title, body }) => (
                <div className="flex items-start gap-4" key={num}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {num}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust + CTA */}
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            Redo att hitta rätt finansprodukt?
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Kom igång på under en minut — helt gratis.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            {[
              "Inga dolda avgifter",
              "GDPR-säkert",
              "Compliance-kontrollerade svar",
              "Alla obligatoriska disclosures",
            ].map((t) => (
              <span className="inline-flex items-center gap-1" key={t}>
                <CheckCircle className="size-3 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            href="/register"
          >
            Skapa gratis konto
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-sm font-semibold">Finansassistenten</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
            <Link className="hover:text-foreground" href="/integritetspolicy">
              Integritetspolicy
            </Link>
            <Link className="hover:text-foreground" href="/ansvarsfriskrivning">
              Ansvarsfriskrivning
            </Link>
            <Link className="hover:text-foreground" href="/login">
              Logga in
            </Link>
            <Link className="hover:text-foreground" href="/register">
              Registrera dig
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground/50 sm:text-right">
            Jämförelsetjänst · Inte finansiell rådgivning
          </p>
        </div>
      </footer>
    </div>
  );
}
