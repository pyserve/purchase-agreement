import { executeFunction } from "./executeFunction";
import { getRecord } from "./getRecord";
import { getRelatedRecords } from "./getRelatedRecords";
import { invokeConnection } from "./invokeConnection";

export const zohoRepo = {
  getRecord,
  getRelatedRecords,
  executeFunction,
  invokeConnection,
};
