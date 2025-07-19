const DocumentList = [
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

export type DocumentType = (typeof DocumentList)[number];

export type Document = {
  id?: string;
  description?: string | null;
  thumbnail?: string | null;
  documentType?: DocumentType;
  module?: string;
  recordId?: string;
  templateName?: string | null;
};
