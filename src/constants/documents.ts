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
        name: "Warranty",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "warranty",
      },
      {
        name: "O.E.R.P",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS_OERP_Form",
      },
      {
        name: "H.R.S.P",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        name: "G.H.G",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        name: "Enbridge",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        name: "In-House Rebate",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        name: "Full House Energy Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Audit Form",
      },
      {
        name: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Heat Pump Participant Agreement",
      },
      {
        name: "Terminate Rental Contract",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
    ];
  } else if (dealer == "Canadian Choice Home Services") {
    return [
      {
        name: "Warranty",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "warranty",
      },
      {
        name: "O.E.R.P",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS_OERP_Form",
      },
      {
        name: "H.R.S.P",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        name: "G.H.G",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS Canada Greener Home Consent Form",
      },
      {
        name: "Enbridge",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "",
      },
      {
        name: "In-House Rebate",
        module: "Leads",
        recordId: leadId,
        templateName: "",
      },
      {
        name: "Full House Energy Audit",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS Energy Audit Release Form",
      },
      {
        name: "Heat Pump Sizing Audit",
        module: "Sales_Orders",
        recordId: salesOrderId,
        templateName: "Heat Pump Participant Agreement",
      },
      {
        name: "Terminate Rental Contract",
        module: "Leads",
        recordId: leadId,
        templateName: "New_CCHS APPOINTMENT OF AUTHORIZED AGENT TO TERMIN",
      },
    ];
  } else {
    return [];
  }
}
