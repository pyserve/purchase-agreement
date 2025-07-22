import type { ZohoDataProvider } from "@/types/zoho";
import { apiRepo } from "./api";
import { zohoRepo } from "./zoho";

export function getRecord<T>({
  dataProvider,
  params,
}: {
  dataProvider: ZohoDataProvider;
  params: Parameters<typeof zohoRepo.getRecord>[0];
}) {
  if (dataProvider === "zoho") {
    return zohoRepo.getRecord<T>(params);
  } else if (dataProvider === "api") {
    return apiRepo.getRecord<T>(params);
  }

  throw new Error(`Unsupported data provider: ${dataProvider}`);
}

export function getRelatedRecords<T>({
  dataProvider,
  params,
}: {
  dataProvider: ZohoDataProvider;
  params: Parameters<typeof zohoRepo.getRelatedRecords>[0];
}) {
  if (dataProvider === "zoho") {
    return zohoRepo.getRelatedRecords<T>(params);
  } else if (dataProvider === "api") {
    return apiRepo.getRelatedRecords<T>(params);
  }

  throw new Error(`Unsupported data provider: ${dataProvider}`);
}

export function executeFunction<T>({
  dataProvider,
  params,
}: {
  dataProvider: ZohoDataProvider;
  params: Parameters<typeof zohoRepo.executeFunction>[0];
}) {
  if (dataProvider === "zoho") {
    return zohoRepo.executeFunction<T>(params);
  } else if (dataProvider === "api") {
    return apiRepo.executeFunction<T>(params);
  }

  throw new Error(`Unsupported data provider: ${dataProvider}`);
}

export function invokeConnection<T>({
  dataProvider,
  params,
}: {
  dataProvider: ZohoDataProvider;
  params: Parameters<typeof zohoRepo.invokeConnection>[0];
}) {
  if (dataProvider === "zoho") {
    return zohoRepo.invokeConnection<T>(params);
  } else if (dataProvider === "api") {
    return apiRepo.invokeConnection<T>(params);
  }

  throw new Error(`Unsupported data provider: ${dataProvider}`);
}
