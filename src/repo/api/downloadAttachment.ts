import axios from "axios";

export async function downloadAttachment<T>({
  method = "GET",
  url,
  parameters = {},
  filename,
}: {
  method: string;
  url: string;
  filename: string;
  parameters?: Record<any, any>;
  connection?: string;
  triggers?: ("workflow" | "automation")[];
}): Promise<T> {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/v2/downloadAttachment`,
    {
      method,
      url,
      data: parameters,
      params: {},
    },
    {
      responseType: "blob",
    },
  );

  const blob = res.data;

  // Create download link and trigger download
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);

  return res.data;
}
