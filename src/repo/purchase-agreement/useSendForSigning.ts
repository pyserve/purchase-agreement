import { sleep } from "@/lib/utils";
import { executeFunction } from "@/repo";
import type { Document } from "@/types/document";
import type { ZohoDataProvider } from "@/types/zoho";
import { useMutation } from "@tanstack/react-query";

type SendForSigningParams = {
  isEmbeddedSigning: boolean;
  sendToPhone: boolean;
  phoneNumber?: string;
  requestDeposit: boolean;
};

type SendForSigningResponse = {
  request_id: string;
  sign_url?: string;
};

async function sendSms(
  dataProvider: ZohoDataProvider,
  phoneNumber?: string,
  signUrl?: string,
) {
  const message = `ECO HOME GROUP: Digital Signature Request. Please sign the document using the following link: ${signUrl}`;

  try {
    await executeFunction({
      dataProvider,
      params: {
        name: "send_sms_twilio",
        params: { to_number: phoneNumber, sms_body: message },
      },
    });
  } catch (error) {
    throw Error("Cannot send SMS. Please send using email.");
  }
}

export function useSendForSigning({
  dataProvider,
  salesOrderId,
  templates,
}: {
  dataProvider: ZohoDataProvider;
  salesOrderId: string;
  templates?: Document[];
}) {
  return useMutation({
    mutationFn: async ({
      isEmbeddedSigning,
      sendToPhone,
      phoneNumber,
      requestDeposit,
    }: SendForSigningParams) => {
      if (sendToPhone && !phoneNumber) throw Error("Phone Number is required");
      await sleep(4000);
      const res = await executeFunction<SendForSigningResponse>({
        dataProvider,
        params: {
          name: "send_purchase_agreement_documents",
          params: {
            sales_order_id: salesOrderId,
            is_embedded: isEmbeddedSigning || sendToPhone,
            security_deposit_required: requestDeposit,
            documents: templates
              ?.filter((v) => v.templateName)
              ?.filter((v) => v.name !== "Agreement"),
          },
        },
      });

      if (sendToPhone) {
        await sendSms(dataProvider, phoneNumber, res.sign_url);
      }

      return res;
    },
  });
}
