import { executeFunction } from "@/repo";
import type { Document } from "@/types/document";
import type { DeliveryMethod } from "@/types/sign";
import type { ZohoDataProvider } from "@/types/zoho";

type SendForSigningParams = {
  dataProvider: ZohoDataProvider;
  salesOrderId: string;
  templates?: Document[];
  isEmbeddedSigning: boolean;
  deliveryMethod: DeliveryMethod;
  phoneNumber?: string;
  requestDeposit: boolean;
};

type SendForSigningResponse = {
  request_id: string;
  sign_url?: string;
};

export async function sendPurchaseAgreement({
  dataProvider,
  salesOrderId,
  templates,
  isEmbeddedSigning,
  deliveryMethod,
  phoneNumber,
  requestDeposit,
}: SendForSigningParams) {
  if (deliveryMethod == "EMAIL_SMS" && !phoneNumber)
    throw Error("Phone Number is required");
  return await executeFunction<SendForSigningResponse>({
    dataProvider,
    params: {
      name: "send_purchase_agreement_documents",
      params: {
        sales_order_id: salesOrderId,
        security_deposit_required: requestDeposit,
        delivery_method: deliveryMethod,
        is_embedded: isEmbeddedSigning,
        documents: templates
          ?.filter((v) => v.templateName)
          ?.filter((v) => v.name !== "Agreement"),
      },
    },
  });
}
