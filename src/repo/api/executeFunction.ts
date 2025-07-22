import { apiRequest } from "@/lib/api";
import { tryJsonParse } from "@/lib/utils";

export async function executeFunction<T>({
  name,
  params,
}: {
  name: string;
  params: Record<string, any>;
}): Promise<T> {
  const req: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "object") {
      req[key] = JSON.stringify(value);
    } else {
      req[key] = value;
    }
  });

  const res = await apiRequest("POST", "executeFunction", {
    func_name: name,
    ...req,
  });

  if (res.data.code !== "success") {
    throw new Error(
      res.data.message?.replace("Custom exception -", "")?.trim(),
    );
  }

  const output = tryJsonParse<T>(res.data.details?.output);

  return output;
}
