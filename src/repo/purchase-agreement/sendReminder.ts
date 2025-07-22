import type { ZohoDataProvider } from "@/types/zoho";
import { invokeConnection } from "..";

export async function sendReminder({
  dataProvider,
  requestId,
}: {
  dataProvider: ZohoDataProvider;
  requestId?: string | null;
}) {
  return invokeConnection({
    dataProvider,
    params: {
      method: "POST",
      url: `https://sign.zoho.com/api/v1/requests/${requestId}/remind`,
      parameters: {},
      connection: "zohosign",
    },
  });
}
