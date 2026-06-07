"use client";

import type { ComplianceCard } from "@/lib/types";

type CompliancePanelProps = {
  cards: ComplianceCard[];
  onClear: () => void;
};

export function CompliancePanel({ cards, onClear }: CompliancePanelProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full rounded-xl border border-amber-300/60 bg-amber-50/70 p-3 shadow-[var(--shadow-card)] dark:border-amber-700/60 dark:bg-amber-950/30"
      data-testid="compliance-panel"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100">
          Compliance Updates
        </h3>
        <button
          className="rounded px-2 py-1 text-[11px] text-amber-900/80 hover:bg-amber-100 dark:text-amber-100/90 dark:hover:bg-amber-900/40"
          onClick={onClear}
          type="button"
        >
          Dismiss
        </button>
      </div>

      <div className="space-y-2">
        {cards.map((card, index) => (
          <div
            className="rounded-lg border border-amber-200/70 bg-white/70 p-2.5 text-[12px] dark:border-amber-700/60 dark:bg-amber-900/20"
            key={`${card.titleSv}-${index}`}
          >
            <div className="font-medium text-amber-900 dark:text-amber-100">
              {card.titleSv}
            </div>
            <div className="mt-1 text-amber-900/90 dark:text-amber-100/90">
              {card.bodySv}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
