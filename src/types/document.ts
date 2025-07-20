export const DOCUMENT_LIST = [
  "Agreement",
  "Warranty",
  "O.E.R.P",
  "H.R.S.P",
  "G.H.G",
  "Enbridge",
  "In-House Rebate",
  "Full House Energy Audit",
  "Heat Pump Sizing Audit",
  "Terminate Rental Contract",
  "HVAC Equipment Acknowledgement Form",
] as const;

export type DocumentName = (typeof DOCUMENT_LIST)[number];

export type Document = {
  name: DocumentName;
  description?: string | null;
  thumbnail?: string | null;
  module?: string | null;
  recordId?: string | null;
  templateName?: string | null;
  agentSignRequired?: boolean;
};
