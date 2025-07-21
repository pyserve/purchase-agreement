import ConfirmationModal from "@/components/document-viewer/confirmation-modal";
import DocumentDisplay from "@/components/document-viewer/document-display";
import DocumentsModal from "@/components/document-viewer/documents-modal";
import RecallModal from "@/components/document-viewer/recall-modal";
import SignedDocumentDisplay from "@/components/document-viewer/signed-document-display";
import ThumbnailSidebar from "@/components/document-viewer/thumbnail-sidebar";
import TopActionBar from "@/components/document-viewer/top-action-bar";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getDocumentTemplates } from "@/constants/documents";
import { useZoho } from "@/providers/zoho-provider";
import { executeFunction, getRecord, getRelatedRecords } from "@/repo";
import { useAgreementRequestStatus } from "@/repo/purchase-agreement/useAgreementRequestStatus";
import { useDataStore } from "@/store/useDataStore";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { Document, DocumentName } from "@/types/document";
import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function getDocumentList(salesOrder?: SalesOrder) {
  let documents: DocumentName[] = [];

  if (salesOrder?.Warranty == "YES") {
    documents = [...documents, "Warranty"];
  }

  documents = [
    ...documents,
    ...(salesOrder?.Rebate_Types ?? []),
    ...(salesOrder?.Energy_Audit_Type ?? []),
  ];

  if (salesOrder?.Dealer == "Canadian Choice Home Services") {
    documents = [...documents, "HVAC Equipment Acknowledgement Form"];
  }

  if (salesOrder?.Old_Equipment_Provider?.includes("Enercare")) {
    documents = [...documents, "Terminate Rental Contract"];
  }

  return documents;
}

export default function PurchaseAgreement() {
  const { module, id, dataProvider } = useZoho();

  const [selectedDocumentName, setSelectedDocumentName] =
    useState<DocumentName | null>();
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isSendForSigningModalOpen, setIsSendForSigningModalOpen] =
    useState(false);
  const [isSignNowModalOpen, setIsSignNowModalOpen] = useState(false);

  const { documents, setDocuments, requestId, setRequestId } =
    useDocumentsStore();
  const { setLead, setSalesOrder } = useDataStore();

  const topElementRef = useRef<HTMLDivElement>(null);

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

  const agreementStatus = useAgreementRequestStatus({
    dataProvider,
    requestId,
  });

  const isLoading =
    leadDetails.isLoading ||
    salesOrderDetails.isLoading ||
    agreementDocument.isLoading ||
    agreementStatus.isLoading;

  const error =
    leadDetails.error ||
    salesOrderDetails.error ||
    agreementDocument.error ||
    agreementStatus.error;

  useEffect(() => {
    if (agreementDocument.data) {
      const documents = getDocumentList(salesOrderDetails.data);
      setDocuments(["Agreement", ...documents]);
      setSelectedDocumentName("Agreement");
    }
  }, [agreementDocument.data]);

  const documentTemplates: Document[] = useMemo(() => {
    if (
      agreementDocument.data &&
      salesOrderDetails.data?.Dealer &&
      salesOrderDetails.data?.Lead_Quote
    ) {
      let allTemplates = getDocumentTemplates(
        salesOrderDetails.data?.Dealer,
        salesOrderDetails.data?.id,
        salesOrderDetails.data?.Lead_Quote?.id,
      );

      return allTemplates.filter((v) => documents?.includes(v.name));
    }
    return [];
  }, [documents]);

  const selectedDocument = documentTemplates?.find(
    (v) => v.name === selectedDocumentName,
  );

  useEffect(() => {
    if (leadDetails.data) {
      setLead(leadDetails.data);
    }
  }, [leadDetails.data]);

  useEffect(() => {
    if (salesOrderDetails.data) {
      setSalesOrder(salesOrderDetails.data);
      setRequestId(salesOrderDetails.data.Sign_Document_ID);
    }
  }, [salesOrderDetails.data]);

  useEffect(() => {
    if (topElementRef.current) {
      topElementRef.current?.scrollIntoView();
    }
  }, [selectedDocumentName]);

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

  if (error || !salesOrderDetails.data || !leadDetails.data) {
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
                {error?.message || "An error occurred while fetching details."}
              </div>
            </AlertDescription>
          </div>

          <div className="mx-auto mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col bg-gray-50"
    >
      <div ref={topElementRef} />
      <TopActionBar
        onRecallClick={() => setIsRecallModalOpen(true)}
        onAddDocumentsClick={() => setIsDocumentsModalOpen(true)}
        onSendForSigningClick={() => setIsSendForSigningModalOpen(true)}
        onSignNowClick={() => setIsSignNowModalOpen(true)}
      />

      <main className="flex flex-1 items-start">
        {agreementStatus.data?.request_status == "inprogress" ||
        agreementStatus.data?.request_status == "completed" ? (
          <SignedDocumentDisplay />
        ) : (
          <>
            <ThumbnailSidebar
              documents={documentTemplates || []}
              selectedDocumentName={selectedDocumentName}
              onDocumentSelect={setSelectedDocumentName}
            />

            <div className="sticky top-16 flex-1">
              <DocumentDisplay
                agreementDocument={agreementDocument.data}
                document={selectedDocument}
              />
            </div>
          </>
        )}
      </main>

      <RecallModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
      />

      <DocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
        dealer={salesOrderDetails.data?.Dealer}
      />

      <ConfirmationModal
        isEmbeddedSigning={false}
        lead={leadDetails.data}
        salesOrder={salesOrderDetails.data}
        documentTemplates={documentTemplates}
        isOpen={isSendForSigningModalOpen}
        onClose={() => setIsSendForSigningModalOpen(false)}
      />

      <ConfirmationModal
        isEmbeddedSigning={true}
        lead={leadDetails.data}
        salesOrder={salesOrderDetails.data}
        documentTemplates={documentTemplates}
        isOpen={isSignNowModalOpen}
        onClose={() => setIsSignNowModalOpen(false)}
      />
    </motion.div>
  );
}
