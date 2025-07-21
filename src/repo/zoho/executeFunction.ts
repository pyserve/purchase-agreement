export async function executeFunction<T>({
  name,
  params,
}: {
  name: string;
  params: Record<string, any>;
}): Promise<T> {
  const res = await window.ZOHO.CRM.FUNCTIONS.execute(name, {
    arguments: JSON.stringify(params),
  });

  if (res.code !== "success") {
    throw new Error(res.message?.replace("Custom exception -", "")?.trim());
  }

  try {
    return JSON.parse(res.details.output);
  } catch (error) {
    return res.details.output;
  }
}
