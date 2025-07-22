import type { ZohoDataProvider } from "@/types/zoho";
import { invokeConnection } from "..";

export async function recallAgreement({
  dataProvider,
  requestId,
  reason,
}: {
  dataProvider: ZohoDataProvider;
  requestId?: string | null;
  reason?: string | null;
}) {
  return invokeConnection({
    dataProvider,
    params: {
      method: "POST",
      url: `https://sign.zoho.com/api/v1/requests/${requestId}/recall?reason=${reason}`,
      parameters: {},
      connection: "zohosign",
    },
  });
}
