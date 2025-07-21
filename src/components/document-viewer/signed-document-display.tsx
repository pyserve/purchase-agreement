import { Card } from "@/components/ui/card";
import { useZoho } from "@/providers/zoho-provider";
import { useAgreementRequestStatus } from "@/repo/purchase-agreement/useAgreementRequestStatus";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import DocumentPreview from "./document-preview";
import DocumentStatusTracker from "./document-status";
import SendReminderCard from "./send-reminder-card";

export default function SignedDocumentDisplay({}: {}) {
  const { dataProvider } = useZoho();
  const { requestId } = useDocumentsStore();

  const { data } = useAgreementRequestStatus({
    dataProvider,
    requestId,
  });

  if (!data) return <></>;

  return (
    <section className="relative grid min-h-[calc(100vh-4em)] w-full grid-cols-[15rem_1fr_15rem] items-start gap-6 bg-gray-100 p-4">
      <div></div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 justify-center">
          <Card className="w-full rounded-md bg-white p-6 shadow-lg">
            <div>
              <div className="text-lg font-medium">{data.request_name}</div>

              <div className="grid grid-cols-[1fr_200px]">
                <div className="mt-4 space-y-2">
                  {[
                    [
                      "Payment Requested",
                      data.actions?.some((v) => v.has_payment) ? "Yes" : "No",
                    ],
                    [
                      "Submitted At",
                      data.sign_submitted_time
                        ? format(data.sign_submitted_time, "PP pp")
                        : "",
                    ],
                    [
                      "Completed At",
                      data.request_status == "completed" && data.action_time
                        ? format(data.action_time, "PP pp")
                        : "",
                    ],
                  ]
                    .filter((v) => !!v[1])
                    .map((v) => (
                      <div className="grid grid-cols-[200px_1fr]" key={v[0]}>
                        <div className="text-sm font-medium">{v[0]}</div>
                        <div className="text-sm">{v[1]}</div>
                      </div>
                    ))}
                </div>

                <div>
                  {data.request_status == "inprogress" && (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          className="h-2 w-2 rounded-full bg-yellow-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span>
                          In Progress ({data.sign_percentage?.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  )}

                  {data.request_status == "completed" && (
                    <div className="flex flex-col items-center">
                      <img
                        src="https://static.zohocdn.com/sign/images/green-doc.6806dd902a148be03b6ad96de183c013.png"
                        height={64}
                        width={64}
                      />
                      <div>Completed</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900">Documents</h4>

              <div className="mt-4 grid grid-cols-5">
                {data.document_ids?.map((document) => (
                  <DocumentPreview key={document.document_id} doc={document} />
                ))}
              </div>
            </div>

            <div className="relative">
              <h4 className="text-md font-medium text-gray-900">Recipients</h4>

              <div className="mt-2 space-y-3">
                {data.actions?.map((v) => (
                  <DocumentStatusTracker key={v.action_id} action={v} />
                ))}
              </div>

              <AnimatePresence mode="sync">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      <div></div>

      {data.request_status == "inprogress" && (
        <div className="fixed top-[5rem] right-6 w-[15em]">
          <SendReminderCard />
        </div>
      )}
    </section>
  );
}
