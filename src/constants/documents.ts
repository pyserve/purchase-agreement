import type { Dealer } from "@/types/dealer";
import type { Document, DocumentName } from "@/types/document";

type ModuleType = "Leads" | "Sales_Orders" | "Tickets";

type TemplateConfig = {
  name: DocumentName;
  module: ModuleType;
  templateNames?: Partial<Record<Dealer, string>>;
  thumbnails?: Partial<Record<Dealer, string>>;
};

const TEMPLATE_CONFIG: TemplateConfig[] = [
  {
    name: "Agreement",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "Agreement",
      "Canadian Choice Home Services": "Agreement",
      "Canadian Eco Home": "Agreement",
    },
    thumbnails: {
      "Weaver Eco Home": "./weh.png",
      "Canadian Choice Home Services": "./cchs.png",
      "Canadian Eco Home": "/ceh.png",
    },
  },
  {
    name: "Warranty",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "warranty",
      "Canadian Choice Home Services": "warranty",
      "Canadian Eco Home": "warranty",
    },
  },
  {
    name: "O.E.R.P",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "New_CCHS_OERP_Form",
      "Canadian Choice Home Services": "New_CCHS_OERP_Form",
      "Canadian Eco Home": "New_CCHS_OERP_Form",
    },
  },
  {
    name: "H.R.S.P",
    module: "Leads",
    templateNames: {
      // "Weaver Eco Home": "HRS_HeatPump_Contractor Terms and Conditions",
      // "Canadian Choice Home Services":
      //   "HRS_HeatPump_Contractor Terms and Conditions",
      // "Canadian Eco Home": "HRS_HeatPump_Contractor Terms and Conditions",
    },
  },
  {
    name: "G.H.G",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services":
        "New_CCHS Canada Greener Home Consent Form",
      "Canadian Eco Home": "CEH Canada Greener Home Consent Form",
    },
  },
  {
    name: "Enbridge",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services": "",
    },
  },
  {
    name: "In-House Rebate",
    module: "Tickets",
    templateNames: {
      // "Weaver Eco Home": "Mutual Release Agreement - In House Rebate",
      // "Canadian Choice Home Services":
      //   "Mutual Release Agreement - In House Rebate",
      // "Canadian Eco Home": "Mutual Release Agreement - In House Rebate",
    },
  },
  {
    name: "Full House Energy Audit",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "Audit Form",
      "Canadian Choice Home Services": "New_CCHS Energy Audit Release Form",
      "Canadian Eco Home": "CEH Energy Audit Release Form",
    },
  },
  {
    name: "Heat Pump Sizing Audit",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "Heat Pump Participant Agreement",
      "Canadian Choice Home Services": "Heat Pump Participant Agreement",
      "Canadian Eco Home": "Heat Pump Participant Agreement",
    },
  },
  {
    name: "Terminate Rental Contract",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services":
        "New_CCHS APPOINTMENT OF AUTHORIZED AGENT TO T",
      "Canadian Eco Home": "CEH_APPOINTMENT OF AUTHORIZED AGENT TO TERMIN",
    },
  },
  {
    name: "HVAC Equipment Acknowledgement Form",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services": "New_CCHS Acknowledgement Form",
      "Canadian Eco Home": "CEH Acknowledgement Form",
    },
  },
];

export function getDocumentTemplates(
  dealer: Dealer,
  salesOrderId?: string,
  leadId?: string,
): Document[] {
  return TEMPLATE_CONFIG.map(({ name, module, templateNames, thumbnails }) => {
    const recordId = module === "Leads" ? leadId : salesOrderId;

    return {
      name,
      module,
      recordId,
      templateName: templateNames?.[dealer] || "",
      thumbnail: thumbnails?.[dealer] || "",
    };
  });
}
