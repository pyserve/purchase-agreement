import type { ZohoModule } from "@/types/zoho";
import { invokeConnection } from "./invokeConnection";

export async function getRecord<T>({
  module,
  id,
}: {
  module: ZohoModule;
  id: string;
}): Promise<T> {
  const res = await invokeConnection<{ data: T[] }>({
    method: "GET",
    url: `https://www.zohoapis.com/crm/v2.1/${module}/${id}`,
  });

  if (!res || !res.data || res.data.length == 0) {
    throw Error("Details not found");
  }

  return res.data[0];
}
