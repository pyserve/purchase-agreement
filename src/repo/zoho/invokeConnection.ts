export async function invokeConnection<T>({
  method = "GET",
  url,
  parameters,
  triggers = ["workflow", "automation"],
}: {
  method: string;
  url: string;
  parameters: Record<any, any>;
  triggers: ("workflow" | "automation")[];
}): Promise<T> {
  const res = await window.ZOHO.CRM.CONNECTION.invoke("crmoauth", {
    method,
    url,
    parameters,
    Trigger: triggers,
  });

  if (res.details.statusMessage.data[0].code != "SUCCESS") {
    throw Error("Error");
  }

  return res;
}
