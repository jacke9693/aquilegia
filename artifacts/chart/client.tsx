"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Artifact } from "@/components/chat/create-artifact";
import { CopyIcon } from "@/components/chat/icons";
import { toast } from "sonner";

export type ChartSpec = {
  chartType: "bar" | "line" | "area" | "pie";
  title: string;
  xKey: string;
  yKeys: Array<{ key: string; label: string }>;
  data: Array<Record<string, string | number>>;
  unit?: string;
  disclaimer?: string;
};

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

function formatValue(value: number, unit?: string) {
  if (!unit) return value.toLocaleString("sv-SE");
  if (unit === "%" || unit.endsWith("%")) {
    return `${value.toLocaleString("sv-SE", { maximumFractionDigits: 2 })}%`;
  }
  return `${value.toLocaleString("sv-SE")} ${unit}`;
}

function FinanceTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-lg text-xs">
      {label && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatValue(entry.value, unit)}
        </p>
      ))}
    </div>
  );
}

function ChartBody({ spec }: { spec: ChartSpec }) {
  const { chartType, xKey, yKeys, data, unit } = spec;
  const height = 260;

  const commonProps = {
    data,
    margin: { top: 8, right: 16, left: 8, bottom: 8 },
  };

  const axisProps = {
    tick: { fontSize: 11, fill: "currentColor", opacity: 0.6 },
    tickLine: false,
    axisLine: false,
  };

  const tooltipEl = (
    <Tooltip
      content={<FinanceTooltip unit={unit} />}
      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
    />
  );

  if (chartType === "pie") {
    const pieKey = yKeys[0]?.key ?? "belopp";
    return (
      <ResponsiveContainer height={height} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey={pieKey}
            innerRadius={60}
            nameKey={xKey}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                key={i}
              />
            ))}
          </Pie>
          <Tooltip
            content={<FinanceTooltip unit={unit} />}
          />
          <Legend
            formatter={(v) => (
              <span className="text-xs text-muted-foreground">{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer height={height} width="100%">
        <LineChart {...commonProps}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis
            tickFormatter={(v) => formatValue(v as number, unit)}
            width={70}
            {...axisProps}
          />
          {tooltipEl}
          <Legend
            formatter={(v) => (
              <span className="text-xs text-muted-foreground">{v}</span>
            )}
          />
          {yKeys.map(({ key, label }, i) => (
            <Line
              dataKey={key}
              dot={false}
              key={key}
              name={label}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "area") {
    return (
      <ResponsiveContainer height={height} width="100%">
        <AreaChart {...commonProps}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis
            tickFormatter={(v) => formatValue(v as number, unit)}
            width={70}
            {...axisProps}
          />
          {tooltipEl}
          <Legend
            formatter={(v) => (
              <span className="text-xs text-muted-foreground">{v}</span>
            )}
          />
          {yKeys.map(({ key, label }, i) => (
            <Area
              dataKey={key}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              fillOpacity={0.15}
              key={key}
              name={label}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // default: bar
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart {...commonProps}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          opacity={0.1}
          vertical={false}
        />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis
          tickFormatter={(v) => formatValue(v as number, unit)}
          width={70}
          {...axisProps}
        />
        {tooltipEl}
        <Legend
          formatter={(v) => (
            <span className="text-xs text-muted-foreground">{v}</span>
          )}
        />
        {yKeys.map(({ key, label }, i) => (
          <Bar
            dataKey={key}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            key={key}
            maxBarSize={48}
            name={label}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

type Metadata = Record<string, never>;

export const chartArtifact = new Artifact<"chart", Metadata>({
  kind: "chart",
  description:
    "Renders interactive finance charts — APR comparisons, amortization schedules, payment breakdowns, and more.",
  initialize: () => {},
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-chartDelta") {
      setArtifact((draft) => ({
        ...draft,
        content: streamPart.data as string,
        status: "streaming",
      }));
    }
  },
  content: ({ content, status }) => {
    if (status === "streaming") {
      return (
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-sm text-muted-foreground animate-pulse">
            Genererar diagram...
          </div>
        </div>
      );
    }

    let spec: ChartSpec | null = null;
    try {
      // Strip markdown code fences the AI sometimes adds despite instructions
      const cleaned = content
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();
      spec = JSON.parse(cleaned) as ChartSpec;

      // Coerce any string numbers in data to actual numbers so Recharts renders them
      if (spec.data) {
        spec.data = spec.data.map((row) => {
          const normalized: Record<string, string | number> = {};
          for (const [k, v] of Object.entries(row)) {
            if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
              normalized[k] = Number(v);
            } else {
              normalized[k] = v;
            }
          }
          return normalized;
        });
      }
    } catch {
      return (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Kunde inte tolka diagramdata.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 p-4">
        {spec.title && (
          <h3 className="font-semibold text-sm text-foreground">{spec.title}</h3>
        )}
        <ChartBody spec={spec} />
        {spec.disclaimer && (
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed border-t border-border/40 pt-2">
            {spec.disclaimer}
          </p>
        )}
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={13} />,
      description: "Copy chart JSON to clipboard",
      onClick: async ({ content }) => {
        await navigator.clipboard.writeText(content);
        toast.success("Diagramdata kopierad");
      },
    },
  ],
  toolbar: [],
});
