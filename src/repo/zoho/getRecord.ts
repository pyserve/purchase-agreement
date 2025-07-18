import type { ZohoModule } from "@/types/zoho";

export async function getRecord<T>({
  module,
  id,
}: {
  module: ZohoModule;
  id: string;
}): Promise<T> {
  const res = await window.ZOHO.CRM.API.getRecord({
    Entity: module,
    RecordID: id,
  });

  if (res.data.length == 0) {
    throw Error("Details not found");
  }

  return res.data[0];
}
