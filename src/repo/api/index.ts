import { downloadAttachment } from "./downloadAttachment";
import { executeFunction } from "./executeFunction";
import { getRecord } from "./getRecord";
import { getRelatedRecords } from "./getRelatedRecords";
import { invokeConnection } from "./invokeConnection";
import { invokeConnectionV2 } from "./invokeConnectionV2";

export const apiRepo = {
  getRecord,
  getRelatedRecords,
  executeFunction,
  invokeConnection,
  invokeConnectionV2,
  downloadAttachment,
};
