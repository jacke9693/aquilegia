import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-md">
        <Link className="font-semibold text-base tracking-tight" href="/">
          Finansassistenten
        </Link>
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

      <main className="mx-auto max-w-3xl px-6 py-14">{children}</main>

      <footer className="border-t border-border/40 bg-muted/20 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
          <Link className="text-sm font-semibold" href="/">
            Finansassistenten
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
            <Link className="hover:text-foreground" href="/integritetspolicy">
              Integritetspolicy
            </Link>
            <Link className="hover:text-foreground" href="/ansvarsfriskrivning">
              Ansvarsfriskrivning
            </Link>
            <Link className="hover:text-foreground" href="/anvandarvillkor">
              Användarvillkor
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground/50">
            Jämförelsetjänst · Inte finansiell rådgivning
          </p>
        </div>
      </footer>
    </div>
  );
}
