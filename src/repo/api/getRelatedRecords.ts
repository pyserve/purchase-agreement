import { apiRequest } from "@/lib/api";
import { tryJsonParse } from "@/lib/utils";
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
  const res = await apiRequest("POST", "getRelatedRecords", {
    Entity: module,
    RecordID: id,
    RelatedList: relatedModule,
    page,
    per_page: size,
  });

  const output = tryJsonParse<{ data: T[] }>(res.data.details?.output);

  if (!output || !output.data || output.data.length == 0) {
    throw Error("Details not found");
  }

  return output.data;
}
