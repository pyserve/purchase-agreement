// To parse this data:
//
//   import { Convert, SalesOrder } from "./file";
//
//   const salesOrder = Convert.toSalesOrder(json);

import type { Dealer } from "./dealer";

export type SalesOrder = {
  Owner?: CreatedBy;
  $field_states?: null;
  $sharing_permission?: string;
  Total_Oversold?: number;
  Lead_Quote?: ContactName;
  $state?: string;
  $process_flow?: boolean;
  Currency?: string;
  Rebate_Required?: string;
  id: string;
  Status?: string;
  Monthly_Payment_After_Deferral?: null;
  $approval?: Approval;
  Rebate_Types?: any[];
  Total1?: number;
  Created_Time: string;
  Payment_Method?: null;
  Pay_Full_Options?: null;
  Deposit_Paid?: boolean;
  Road_Trip?: string;
  Total_Retail_Price?: number;
  Created_By?: CreatedBy;
  Security_Deposit_Required?: null;
  Description?: string;
  Discount?: number;
  $review_process?: ReviewProcess;
  Agent_Promotional_Discount?: null;
  Manufacture_Rebate_Amount?: null;
  Financeit_Program_Name?: null;
  Amortization?: string;
  Est_Installation_Date?: null;
  Purchase_Agreement_Sent?: string;
  Sign_Document_ID?: string;
  Terms_and_Conditions?: null;
  Parts_Warranty?: null;
  Sub_Total?: number;
  $orchestration?: boolean;
  Contact_Name?: ContactName;
  Financeit_Cost?: number;
  Package_Discount_Applied?: boolean;
  Layout?: Layout;
  SO_Number?: string;
  Est_Installation_Duration?: number;
  Locked__s?: boolean;
  Line_Items?: string;
  $line_tax?: LineTax[];
  Tag?: any[];
  sign_url?: null;
  Minimum_Terms?: null;
  Monthly_Payment?: number;
  TOTAL_PAYMENT?: number;
  $currency_symbol?: string;
  Deferral_Time?: string;
  Interest_Rate?: string;
  Tax?: number;
  Energy_Audit?: string;
  Last_Activity_Time?: Date;
  $converted?: boolean;
  Deal_Name?: null;
  Exchange_Rate?: number;
  $locked_for_me?: boolean;
  Total_Distance_Cost?: number;
  Loan_Application_Number?: string;
  $approved?: boolean;
  Custom_Terms?: null;
  Warranty?: string;
  Term_Months?: string;
  Old_Equipment?: string;
  Energy_Audit_Type?: any[];
  $wizard_connection_path?: null;
  $editable?: boolean;
  Eligible_Package_Discount?: null;
  Balance?: number;
  Financeit_Program?: number;
  Agent_Discount_Applied?: boolean;
  Discount1?: number;
  $layout_id?: Layout;
  Est_Installation_Date2?: null;
  Total_Terms?: null;
  Financing_Program?: null;
  Government_Loan_Required?: string;
  Modified_By?: CreatedBy;
  $review?: null;
  Sales_Commission?: null;
  Modified_Time?: Date;
  Security_Deposit?: number;
  Subject?: string;
  Sub_Total1?: null;
  Eligible_Pay_Upfront_Discount?: null;
  Old_Equipment_Provider?: string;
  APP_Number?: string;
  $in_merge?: boolean;
  Total?: number;
  Extras_Retail_Cost?: number;
  Est_Installation_Datetime?: null;
  CX_ID?: string;
  $approval_state?: string;
  Wizard?: null;
  Financing_Company?: string;
  Sales_Type?: string;
  Dealer?: Dealer;
};

export type Approval = {
  delegate?: boolean;
  takeover?: boolean;
  approve?: boolean;
  reject?: boolean;
  resubmit?: boolean;
};

export type Layout = {
  display_label?: string;
  name?: string;
  id?: string;
};

export type LineTax = {
  percentage?: number;
  name?: string;
  id?: string;
  value?: number;
};

export type ReviewProcess = {
  approve?: boolean;
  reject?: boolean;
  resubmit?: boolean;
};

export type ContactName = {
  name?: string;
  id?: string;
};

export type CreatedBy = {
  name?: string;
  id?: string;
  email?: string;
};

// Converts JSON strings to/from your types
export class Convert {
  public static toSalesOrder(json: string): SalesOrder {
    return JSON.parse(json);
  }

  public static salesOrderToJson(value: SalesOrder): string {
    return JSON.stringify(value);
  }
}
