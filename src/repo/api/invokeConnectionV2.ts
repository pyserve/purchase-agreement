import axios from "axios";

export async function invokeConnectionV2<T>({
  method = "GET",
  url,
  parameters = {},
}: {
  method: string;
  url: string;
  parameters?: Record<any, any>;
  connection?: string;
  triggers?: ("workflow" | "automation")[];
}): Promise<T> {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/v2/invokeConnection`,
    {
      method,
      url,
      data: parameters,
      params: {},
    },
  );

  return res.data;
}
