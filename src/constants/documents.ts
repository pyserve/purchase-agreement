import type { Dealer } from "@/types/dealer";

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

export type TemplateData = {
  documentType: DocumentType;
  module: string;
  record_id: string;
  template_name: string;
};

export function getDocumentTemplates(
  dealer: Dealer,
  salesOrderId: string,
  leadId: string
): TemplateData[] {
  if (dealer == "Weaver Eco Home") {
    return [
      {
        documentType: "Warranty",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "warranty",
      },
      {
        documentType: "O.E.R.P",
        module: "Leads",
        record_id: leadId,
        template_name: "New_CCHS_OERP_Form",
      },
      {
        documentType: "H.R.S.P",
        module: "Leads",
        record_id: leadId,
        template_name: "",
      },
      {
        documentType: "G.H.G",
        module: "Leads",
        record_id: leadId,
        template_name: "",
      },
      {
        documentType: "Enbridge",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "",
      },
      {
        documentType: "In-House Rebate",
        module: "Leads",
        record_id: leadId,
        template_name: "",
      },
      {
        documentType: "Full House Energy Audit",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "Audit Form",
      },
      {
        documentType: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "Heat Pump Participant Agreement",
      },
      {
        documentType: "Terminate Rental Contract",
        module: "Leads",
        record_id: leadId,
        template_name: "",
      },
    ];
  } else if (dealer == "Canadian Choice Home Services") {
    return [
      {
        documentType: "Warranty",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "warranty",
      },
      {
        documentType: "O.E.R.P",
        module: "Leads",
        record_id: leadId,
        template_name: "New_CCHS_OERP_Form",
      },
      {
        documentType: "H.R.S.P",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "",
      },
      {
        documentType: "G.H.G",
        module: "Leads",
        record_id: leadId,
        template_name: "New_CCHS Canada Greener Home Consent Form",
      },
      {
        documentType: "Enbridge",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "",
      },
      {
        documentType: "In-House Rebate",
        module: "Leads",
        record_id: leadId,
        template_name: "",
      },
      {
        documentType: "Full House Energy Audit",
        module: "Leads",
        record_id: leadId,
        template_name: "New_CCHS Energy Audit Release Form",
      },
      {
        documentType: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        record_id: salesOrderId,
        template_name: "Heat Pump Participant Agreement",
      },
      {
        documentType: "Terminate Rental Contract",
        module: "Leads",
        record_id: leadId,
        template_name: "New_CCHS APPOINTMENT OF AUTHORIZED AGENT TO T",
      },
    ];
  } else {
    return [];
  }
}
