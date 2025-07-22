import { apiRequest } from "@/lib/api";
import { tryJsonParse } from "@/lib/utils";

export async function invokeConnection<T>({
  method = "GET",
  url,
  parameters = {},
  connection = "crmoauth",
  triggers = ["workflow", "automation"],
}: {
  method: string;
  url: string;
  parameters?: Record<any, any>;
  connection?: string;
  triggers?: ("workflow" | "automation")[];
}): Promise<T> {
  const res = await apiRequest(
    "POST",
    `invokeConnection/${method.toLowerCase()}`,
    {
      parameters,
      url,
      triggers,
      connection,
    },
  );
  const output = tryJsonParse<T>(res.data.details?.output);

  return output;
}
