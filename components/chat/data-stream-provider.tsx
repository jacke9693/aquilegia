"use client";

import type { DataUIPart } from "ai";
import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { ComplianceCard, CustomUIDataTypes } from "@/lib/types";

type DataStreamContextValue = {
  dataStream: DataUIPart<CustomUIDataTypes>[];
  setDataStream: React.Dispatch<
    React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
  >;
  complianceCards: ComplianceCard[];
  setComplianceCards: React.Dispatch<React.SetStateAction<ComplianceCard[]>>;
};

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
    []
  );
  const [complianceCards, setComplianceCards] = useState<ComplianceCard[]>([]);

  const value = useMemo(
    () => ({
      dataStream,
      setDataStream,
      complianceCards,
      setComplianceCards,
    }),
    [dataStream, complianceCards]
  );

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error("useDataStream must be used within a DataStreamProvider");
  }
  return context;
}
