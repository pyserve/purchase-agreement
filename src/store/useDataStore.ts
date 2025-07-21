import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import { create } from "zustand";

type DataStore = {
  lead?: Lead | null;
  setLead: (lead: Lead) => void;
  salesOrder?: SalesOrder | null;
  setSalesOrder: (salesOrder?: SalesOrder) => void;
  clear: () => void;
};

export const useDataStore = create<DataStore>((set) => ({
  lead: null,
  setLead: (lead) => set({ lead }),
  salesOrder: null,
  setSalesOrder: (salesOrder) => set({ salesOrder }),
  clear: () => set({ lead: null, salesOrder: null }),
}));
