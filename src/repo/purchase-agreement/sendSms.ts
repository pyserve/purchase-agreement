import type { ZohoDataProvider } from "@/types/zoho";
import { executeFunction } from "..";

export async function sendSms(
  dataProvider: ZohoDataProvider,
  phoneNumber?: string,
  message?: string,
) {
  return await executeFunction({
    dataProvider,
    params: {
      name: "send_sms_twilio",
      params: { to_number: phoneNumber, sms_body: message },
    },
  });
}
