import DocumentDisplay from "@/components/document-viewer/document-display";
import DocumentsModal from "@/components/document-viewer/documents-modal";
import RecallModal from "@/components/document-viewer/recall-modal";
import ThumbnailSidebar from "@/components/document-viewer/thumbnail-sidebar";
import TopActionBar from "@/components/document-viewer/top-action-bar";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useZoho } from "@/providers/zoho-provider";
import { executeFunction, getRecord, getRelatedRecords } from "@/repo";
import type { Document } from "@/types/document";
import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function PurchaseAgreement() {
  const { module, id, dataProvider } = useZoho();

  const leadDetails = useQuery({
    queryKey: ["leadDetails", id],
    queryFn: async () => {
      if (module == "Leads") {
        return await getRecord<Lead>({
          dataProvider,
          params: { module: "Leads", id },
        });
      }

      throw new Error(`Unsupported module: ${module}`);
    },
  });

  const salesOrderDetails = useQuery({
    enabled: leadDetails.isSuccess,
    queryKey: ["salesOrderDetails", id],
    queryFn: async () => {
      if (module == "Leads") {
        const res = await getRelatedRecords<SalesOrder>({
          dataProvider,
          params: { module: "Leads", id, relatedModule: "Sales_Order" },
        });

        return res.sort(
          (a, b) =>
            new Date(b.Created_Time).getTime() -
            new Date(a.Created_Time).getTime(),
        )[0];
      }

      throw new Error(`Unsupported module: ${module}`);
    },
  });

  const agreementDocument = useQuery({
    enabled: salesOrderDetails.isSuccess,
    queryKey: ["agreementDocument", salesOrderDetails.data?.id],
    queryFn: async () => {
      return await executeFunction<string>({
        dataProvider,
        params: {
          name: "get_sales_order_agreement",
          params: { id: salesOrderDetails.data?.id },
        },
      });
    },
  });

  const [selectedDocumentId, setSelectedDocumentId] = useState<number>(1);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [depositEnabled, setDepositEnabled] = useState(false);

  const documents = [
    { id: 1, name: "voluptate" },
    { id: 2, name: "laneopza" },
  ];

  const {
    // data: documents,
    // isLoading,
    // error,
  } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const isLoading =
    leadDetails.isLoading ||
    salesOrderDetails.isLoading ||
    agreementDocument.isLoading;
  const error =
    leadDetails.error || salesOrderDetails.error || agreementDocument.error;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-100">
        <div className="bg-card text-card-foreground grid-cols relative grid w-full max-w-md items-start gap-y-2 rounded-lg border px-4 py-3 text-sm">
          <div className="bg-destructive/10 mx-auto flex h-12 w-12 flex-row items-center justify-center rounded-full">
            <AlertCircleIcon className="text-destructive h-6 w-6" />
          </div>

          <div>
            <AlertTitle className="text-center">Error</AlertTitle>

            <AlertDescription className="text-center">
              <div className="w-full text-center">
                {error.message || "An error occurred while fetching details."}
              </div>
            </AlertDescription>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="text-xs">
  //     <pre>{JSON.stringify(agreementDocument, null, 2)}</pre>
  //   </div>
  // );

  const selectedDocument = documents?.find(
    (doc) => doc.id === selectedDocumentId,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col bg-gray-50"
    >
      <TopActionBar
        selectedDocument={selectedDocument}
        depositEnabled={depositEnabled}
        onDepositToggle={() => setDepositEnabled(!depositEnabled)}
        onRecallClick={() => setIsRecallModalOpen(true)}
        onAddDocumentsClick={() => setIsDocumentsModalOpen(true)}
      />

      <main className="flex flex-1">
        <ThumbnailSidebar
          documents={documents || []}
          selectedDocumentId={selectedDocumentId}
          onDocumentSelect={setSelectedDocumentId}
        />

        <DocumentDisplay
          id={agreementDocument.data ?? ""}
          document={selectedDocument}
          documents={documents || []}
          onDocumentSelect={setSelectedDocumentId}
        />
      </main>

      <RecallModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
        documentId={selectedDocumentId}
      />

      <DocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
      />
    </motion.div>
  );
}
