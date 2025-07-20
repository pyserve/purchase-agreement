import type { ZohoModule, ZohoRelatedModule } from "@/types/zoho";

export async function getRelatedRecords<T>({
  module,
  relatedModule,
  id,
  page = 1,
  size = 200,
}: {
  module: ZohoModule;
  id: string;
  relatedModule: ZohoRelatedModule;
  page?: number;
  size?: number;
}): Promise<T[]> {
  const res = await window.ZOHO.CRM.API.getRelatedRecords({
    Entity: module,
    RecordID: id,
    RelatedList: relatedModule,
    page: page,
    per_page: size,
  });

  if (res.data.length == 0) {
    throw Error("Details not found");
  }

  return res.data;
}
