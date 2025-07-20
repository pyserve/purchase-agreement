export async function invokeConnection<T>({
  method = "GET",
  url,
  parameters,
  connection = "crmoauth",
  triggers = ["workflow", "automation"],
}: {
  method: string;
  url: string;
  parameters: Record<any, any>;
  connection?: string;
  triggers?: ("workflow" | "automation")[];
}): Promise<T> {
  const res = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
    method,
    url,
    parameters,
    Trigger: triggers,
  });

  if (res.code != "SUCCESS") {
    throw Error(res.message);
  }

  if (
    res.details?.statusMessage?.status &&
    res.details?.statusMessage?.status == "failure"
  ) {
    throw Error(res.details.statusMessage.message);
  }

  return res.details;
}
