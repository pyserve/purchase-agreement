// To parse this data:
//
//   import { Convert, SignDocumentStatus } from "./file";
//
//   const signDocumentStatus = Convert.toSignDocumentStatus(json);

export type SignDocumentStatus = {
  statusMessage?: StatusMessage;
  status?: string;
};

export type StatusMessage = {
  code?: number;
  requests?: DocumentRequests;
  message?: string;
  status?: string;
};

export type DocumentRequests = {
  request_status?: "inprogress" | "completed" | "recalled" | string;
  notes?: string;
  attachments?: any[];
  reminder_period?: number;
  owner_id?: string;
  description?: string;
  request_name?: string;
  modified_time?: number;
  action_time?: number;
  is_deleted?: boolean;
  expiration_days?: number;
  is_sequential?: boolean;
  sign_submitted_time?: number;
  templates_used?: any[];
  owner_first_name?: string;
  sign_percentage?: number;
  expire_by?: number;
  is_expiring?: boolean;
  owner_email?: string;
  created_time?: number;
  email_reminders?: boolean;
  document_ids?: DocumentID[];
  self_sign?: boolean;
  document_fields?: DocumentField[];
  allow_add_comments?: boolean;
  in_process?: boolean;
  validity?: number;
  request_type_name?: string;
  visible_sign_settings?: VisibleSignSettings;
  request_id?: string;
  zsdocumentid?: string;
  request_type_id?: string;
  owner_last_name?: string;
  actions?: Action[];
  attachment_size?: number;
};

export type Action = {
  verify_recipient?: boolean;
  recipient_countrycode_iso?: string;
  action_type?: string;
  cloud_provider_name?: string;
  has_payment?: boolean;
  recipient_email?: string;
  send_completed_document?: boolean;
  allow_signing?: boolean;
  recipient_phonenumber?: string;
  is_bulk?: boolean;
  action_id?: string;
  is_revoked?: boolean;
  is_embedded?: boolean;
  signing_order?: number;
  cloud_provider_id?: number;
  recipient_name?: string;
  fields?: Field[];
  delivery_mode?: string;
  action_status: string;
  is_signing_group?: boolean;
  recipient_countrycode?: string;
};

export type Field = {
  field_id?: string;
  x_coord?: number;
  field_type_id?: string;
  abs_height?: number;
  field_category?: string;
  is_disabled?: boolean;
  field_label?: string;
  is_hidden?: boolean;
  is_mandatory?: boolean;
  page_no?: number;
  document_id?: string;
  is_draggable?: boolean;
  field_name?: string;
  y_value?: number;
  abs_width?: number;
  action_id?: string;
  width?: number;
  y_coord?: number;
  field_type_name?: string;
  description_tooltip?: string;
  x_value?: number;
  is_resizable?: boolean;
  height?: number;
  text_property?: TextProperty;
  time_zone_offset?: number;
  field_value?: string;
  time_zone?: string;
  date_format?: string;
  default_value?: boolean;
  is_read_only?: boolean;
};

export type TextProperty = {
  is_italic?: boolean;
  max_field_length?: number;
  is_underline?: boolean;
  font_color?: string;
  is_fixed_width?: boolean;
  font_size?: number;
  is_fixed_height?: boolean;
  is_read_only?: boolean;
  alignment?: string;
  is_bold?: boolean;
  font?: string;
};

export type DocumentField = {
  document_id?: string;
  fields?: any[];
};

export type DocumentID = {
  image_string?: string;
  document_name?: string;
  pages?: Page[];
  document_size?: number;
  document_order?: string;
  is_nom151_present?: boolean;
  is_editable?: boolean;
  total_pages?: number;
  document_id?: string;
};

export type Page = {
  image_string?: string;
  page?: number;
  is_thumbnail?: boolean;
};

export type VisibleSignSettings = {
  visible_sign?: boolean;
  allow_reason_visible_sign?: boolean;
};

// Converts JSON strings to/from your types
export class Convert {
  public static toSignDocumentStatus(json: string): SignDocumentStatus {
    return JSON.parse(json);
  }

  public static signDocumentStatusToJson(value: SignDocumentStatus): string {
    return JSON.stringify(value);
  }
}
