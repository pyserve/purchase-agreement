// To parse this data:
//
//   import { Convert, SalesOrder } from "./file";
//
//   const salesOrder = Convert.toSalesOrder(json);

import type { Dealer } from "./dealer";

export type SalesOrder = {
  Owner?: CreatedBy;
  $field_states?: null;
  Total_Oversold?: number;
  Lead_Quote?: LeadQuote;
  $state?: string;
  $process_flow?: boolean;
  Currency?: string;
  Rebate_Required?: string;
  id: string;
  Status?: string;
  Monthly_Payment_After_Deferral?: null;
  $approval?: Approval;
  Rebate_Types?: any[];
  Created_Time: string;
  Payment_Method?: string;
  Pay_Full_Options?: null;
  Deposit_Paid?: boolean;
  Road_Trip?: string;
  Total_Retail_Price?: number;
  $status?: string;
  Created_By?: CreatedBy;
  Security_Deposit_Required?: null;
  Description?: null;
  Discount?: number;
  $review_process?: ReviewProcess;
  Agent_Promotional_Discount?: null;
  Manufacture_Rebate_Amount?: null;
  Financeit_Program_Name?: string;
  Amortization?: string;
  Est_Installation_Date?: null;
  Purchase_Agreement_Sent?: string;
  Sign_Document_ID?: null;
  Terms_and_Conditions?: null;
  Parts_Warranty?: null;
  Sub_Total?: number;
  $orchestration?: boolean;
  Contact_Name?: Name;
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
  $currency_symbol?: string;
  Deferral_Time?: string;
  Interest_Rate?: string;
  Tax?: number;
  Energy_Audit?: string;
  Last_Activity_Time?: string;
  $converted?: boolean;
  Deal_Name?: Name;
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
  $editable?: boolean;
  Product_Details?: ProductDetail[];
  Eligible_Package_Discount?: null;
  Financeit_Program?: null;
  Agent_Discount_Applied?: boolean;
  Discount1?: number;
  $layout_id?: Layout;
  Est_Installation_Date2?: string;
  Total_Terms?: null;
  Financing_Program?: string;
  Government_Loan_Required?: string;
  Modified_By?: CreatedBy;
  $review?: null;
  Financeit_Terms?: string;
  Sales_Commission?: null;
  Modified_Time?: string;
  Subject?: string;
  Sub_Total1?: null;
  Eligible_Pay_Upfront_Discount?: null;
  Old_Equipment_Provider?: string;
  APP_Number?: string;
  $in_merge?: boolean;
  Total?: number;
  Extras_Retail_Cost?: number;
  Est_Installation_Datetime?: string;
  CX_ID?: string;
  $approval_state?: string;
  Wizard?: null;
  Financing_Company?: string;
  Sales_Type?: string;
  Dealer?: Dealer;
  $has_more?: HasMore;
};

export type Approval = {
  delegate?: boolean;
  takeover?: boolean;
  approve?: boolean;
  reject?: boolean;
  recall?: boolean;
  resubmit?: boolean;
};

export type HasMore = {
  Financeit_Terms?: boolean;
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

export type Name = {
  name?: string;
  id?: string;
};

export type CreatedBy = {
  name?: string;
  id?: string;
  email?: string;
};

export type LeadQuote = {
  module?: string;
  name?: string;
  id?: string;
};

export type ProductDetail = {
  product?: Product;
  quantity?: number;
  Discount?: number;
  total_after_discount?: number;
  net_total?: number;
  book?: null;
  Tax?: number;
  list_price?: number;
  unit_price?: number | null;
  quantity_in_stock?: number;
  total?: number;
  id?: string;
  product_description?: null;
  line_tax?: any[];
};

export type Product = {
  Product_Code?: string;
  Currency?: string;
  name?: string;
  id?: string;
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
