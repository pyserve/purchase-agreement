import type { Dealer } from "@/types/dealer";
import type { Document, DocumentName } from "@/types/document";

type ModuleType = "Leads" | "Sales_Orders";

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
      "Canadian Eco Home": "/weh.png",
    },
  },
  {
    name: "Warranty",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "warranty",
      "Canadian Choice Home Services": "warranty",
    },
  },
  {
    name: "O.E.R.P",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "New_CCHS_OERP_Form",
      "Canadian Choice Home Services": "New_CCHS_OERP_Form",
    },
  },
  {
    name: "H.R.S.P",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services": "",
    },
  },
  {
    name: "G.H.G",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services":
        "New_CCHS Canada Greener Home Consent Form",
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
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services": "",
    },
  },
  {
    name: "Full House Energy Audit",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "Audit Form",
      "Canadian Choice Home Services": "New_CCHS Energy Audit Release Form",
    },
  },
  {
    name: "Heat Pump Sizing Audit",
    module: "Sales_Orders",
    templateNames: {
      "Weaver Eco Home": "Heat Pump Participant Agreement",
      "Canadian Choice Home Services": "Heat Pump Participant Agreement",
    },
  },
  {
    name: "Terminate Rental Contract",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services":
        "New_CCHS APPOINTMENT OF AUTHORIZED AGENT TO TERMIN",
    },
  },
  {
    name: "HVAC Equipment Acknowledgement Form",
    module: "Leads",
    templateNames: {
      "Weaver Eco Home": "",
      "Canadian Choice Home Services": "New_CCHS Acknowledgement Form",
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
