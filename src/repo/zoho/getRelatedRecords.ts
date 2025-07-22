import type { ZohoModule, ZohoRelatedModule } from "@/types/zoho";
import { invokeConnection } from "./invokeConnection";

export async function getRelatedRecords<T>({
  module,
  relatedModule,
  id,
}: {
  module: ZohoModule;
  id: string;
  relatedModule: ZohoRelatedModule;
  page?: number;
  size?: number;
}): Promise<T[]> {
  const res = await invokeConnection<{ data: T[] }>({
    method: "GET",
    url: `https://www.zohoapis.com/crm/v2.1/${module}/${id}/${relatedModule}`,
  });

  if (!res.data || res.data.length == 0) {
    throw Error(`Details not found for ${module} & ${relatedModule}`);
  }

  return res.data;
}
