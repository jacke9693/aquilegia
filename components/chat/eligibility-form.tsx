"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPOSES = [
  { value: "personal-loan", label: "Privatlån" },
  { value: "business-loan", label: "Företagslån" },
  { value: "investment", label: "Investering" },
  { value: "savings", label: "Sparande" },
  { value: "pension", label: "Pension" },
] as const;

type Purpose = (typeof PURPOSES)[number]["value"];

type EligibilityFormProps = {
  onSubmit: (message: string) => void;
  onClose: () => void;
};

function ToggleGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          className={cn(
            "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
            value === opt.value
              ? "border-primary bg-primary/10 font-medium text-primary"
              : "border-border/50 hover:bg-muted"
          )}
          key={opt.value}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function EligibilityForm({ onSubmit, onClose }: EligibilityFormProps) {
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("no");
  const [kronofogden, setKronofogden] = useState("no");
  const [yearsInSweden, setYearsInSweden] = useState("");
  const [purpose, setPurpose] = useState<Purpose | "">("");
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    age !== "" &&
    Number(age) >= 18 &&
    income !== "" &&
    Number(income) > 0 &&
    yearsInSweden !== "" &&
    purpose !== "";

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/compliance/eligibility`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: Number(age),
            monthlyIncomeSek: Number(income),
            paymentRemarksCount: paymentRemarks === "no" ? 0 : 1,
            activeKronofogdenDebt: kronofogden === "yes",
            yearsInSweden: Number(yearsInSweden),
            purpose,
          }),
        }
      );
    } catch {
      // non-fatal — chat route also parses from message text
    }

    const purposeLabel =
      PURPOSES.find((p) => p.value === purpose)?.label ?? purpose;
    const remarksText =
      paymentRemarks === "no"
        ? "inga betalningsanmärkningar"
        : "betalningsanmärkningar";
    const kronofogdenText =
      kronofogden === "no" ? "ingen Kronofogdenskuld" : "aktiv Kronofogdenskuld";

    const message = [
      "Mina behörighetsuppgifter:",
      `ålder: ${age} år`,
      `månadsinkomst: ${Number(income).toLocaleString("sv-SE")} SEK`,
      remarksText,
      kronofogdenText,
      `bott i Sverige: ${yearsInSweden} år`,
      `syfte: ${purposeLabel}`,
    ].join(", ");

    onSubmit(message);
    onClose();
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <span className="font-semibold text-sm">Behörighetsuppgifter</span>
        <button
          className="text-muted-foreground transition-colors hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4 px-4 py-4">
        {/* Age + Income */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Ålder
            </label>
            <input
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-0"
              max={80}
              min={18}
              onChange={(e) => setAge(e.target.value)}
              placeholder="28"
              type="number"
              value={age}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Månadsinkomst (SEK)
            </label>
            <input
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-0"
              min={0}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="35 000"
              type="number"
              value={income}
            />
          </div>
        </div>

        {/* Payment remarks */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Betalningsanmärkningar
          </label>
          <ToggleGroup
            onChange={setPaymentRemarks}
            options={[
              { value: "no", label: "Nej" },
              { value: "yes", label: "Ja" },
            ]}
            value={paymentRemarks}
          />
        </div>

        {/* Kronofogden */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Aktiv skuld hos Kronofogden
          </label>
          <ToggleGroup
            onChange={setKronofogden}
            options={[
              { value: "no", label: "Nej" },
              { value: "yes", label: "Ja" },
            ]}
            value={kronofogden}
          />
        </div>

        {/* Years in Sweden */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            År bosatt i Sverige
          </label>
          <input
            className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-0"
            max={80}
            min={0}
            onChange={(e) => setYearsInSweden(e.target.value)}
            placeholder="5"
            type="number"
            value={yearsInSweden}
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Syfte
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PURPOSES.map(({ value, label }) => (
              <button
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs transition-colors",
                  purpose === value
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-border/50 hover:bg-muted"
                )}
                key={value}
                onClick={() => setPurpose(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-3">
        <button
          className={cn(
            "w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            isValid && !submitting
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          )}
          disabled={!isValid || submitting}
          onClick={handleSubmit}
          type="button"
        >
          {submitting ? "Sparar..." : "Spara och fortsätt"}
        </button>
      </div>
    </div>
  );
}
