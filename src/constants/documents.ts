import type { Dealer } from "@/types/dealer";
import type { Document } from "@/types/document";

export function getDocumentTemplates(
  dealer: Dealer,
  salesOrderId?: string,
  leadId?: string,
): Document[] {
  if (dealer == "Weaver Eco Home") {
    return [
      {
        documentType: "Warranty",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "warranty",
      },
      {
        documentType: "O.E.R.P",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS_OERP_Form",
      },
      {
        documentType: "H.R.S.P",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        documentType: "G.H.G",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        documentType: "Enbridge",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        documentType: "In-House Rebate",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        documentType: "Full House Energy Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Audit Form",
      },
      {
        documentType: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Heat Pump Participant Agreement",
      },
      {
        documentType: "Terminate Rental Contract",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
    ];
  } else if (dealer == "Canadian Choice Home Services") {
    return [
      {
        documentType: "Warranty",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "warranty",
      },
      {
        documentType: "O.E.R.P",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS_OERP_Form",
      },
      {
        documentType: "H.R.S.P",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        documentType: "G.H.G",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS Canada Greener Home Consent Form",
      },
      {
        documentType: "Enbridge",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        documentType: "In-House Rebate",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        documentType: "Full House Energy Audit",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS Energy Audit Release Form",
      },
      {
        documentType: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Heat Pump Participant Agreement",
      },
      {
        documentType: "Terminate Rental Contract",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS APPOINTMENT OF AUTHORIZED AGENT TO TERMIN",
      },
    ];
  } else {
    return [];
  }
}
