import DocumentDisplay from "@/components/document-viewer/document-display";
import DocumentsModal from "@/components/document-viewer/documents-modal";
import RecallModal from "@/components/document-viewer/recall-modal";
import SendForSigningModal from "@/components/document-viewer/send-for-signing-modal";
import ThumbnailSidebar from "@/components/document-viewer/thumbnail-sidebar";
import TopActionBar from "@/components/document-viewer/top-action-bar";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDocumentTemplates } from "@/constants/documents";
import { useZoho } from "@/providers/zoho-provider";
import { executeFunction, getRecord, getRelatedRecords } from "@/repo";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { Dealer } from "@/types/dealer";
import type { Document, DocumentType } from "@/types/document";
import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getDocumentList(salesOrder?: SalesOrder) {
  let documents: DocumentType[] = [];

  salesOrder?.Rebate_Types;

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

  const [requestId, setRequestId] = useState<string | null>();
  const [signUrl, setSignUrl] = useState<string | null>();

  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>();
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isSendForSigningModalOpen, setIsSendForSigningModalOpen] =
    useState(false);

  const { documents, addDocument, removeDocument, setDocuments } =
    useDocumentsStore();

  const topElementRef = useRef<HTMLDivElement>(null);

  const selectedDocument = documents?.find(
    (doc) => doc.documentType === selectedDocumentType,
  );

  const isLoading =
    leadDetails.isLoading ||
    salesOrderDetails.isLoading ||
    agreementDocument.isLoading;
  const error =
    leadDetails.error || salesOrderDetails.error || agreementDocument.error;

  useEffect(() => {
    if (
      agreementDocument.data &&
      salesOrderDetails.data?.Dealer &&
      salesOrderDetails.data?.Lead_Quote
    ) {
      const thumbnails: Record<Dealer, string> = {
        "Canadian Choice Home Services": "/cchs.png",
        "Canadian Eco Home": "/weh.png",
        "Weaver Eco Home": "/weh.png",
      };

      let documents: Document[] = [
        {
          id: agreementDocument.data,
          documentType: "Agreement",
          thumbnail: salesOrderDetails.data?.Dealer
            ? thumbnails[salesOrderDetails.data?.Dealer]
            : null,
        },
      ];

      const documentNames = getDocumentList(salesOrderDetails.data);

      let templates = getDocumentTemplates(
        salesOrderDetails.data.Dealer,
        salesOrderDetails.data.id,
        salesOrderDetails.data.Lead_Quote.id,
      );

      for (const documentType of documentNames) {
        const template = templates.find((v) => v.documentType == documentType);

        if (template && template.templateName) {
          documents = [...documents, template];
        }
      }

      setDocuments(documents);
      setSelectedDocumentType("Agreement");
    }
  }, [agreementDocument.data]);

  useEffect(() => {
    setRequestId(salesOrderDetails.data?.Sign_Document_ID);
    setSignUrl(salesOrderDetails.data?.sign_url);
  }, [salesOrderDetails.data]);

  useEffect(() => {
    if (topElementRef.current) {
      topElementRef.current?.scrollIntoView();
    }
  }, [selectedDocumentType]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col justify-start bg-gray-50"
    >
      <div ref={topElementRef} />
      <TopActionBar
        selectedDocument={selectedDocument}
        onRecallClick={() => setIsRecallModalOpen(true)}
        onAddDocumentsClick={() => setIsDocumentsModalOpen(true)}
        onSendForSigningClick={() => setIsSendForSigningModalOpen(true)}
      />

      <main className="flex flex-1">
        <ThumbnailSidebar
          documents={documents || []}
          selectedDocumentType={selectedDocumentType}
          onDocumentSelect={setSelectedDocumentType}
        />

        <DocumentDisplay document={selectedDocument} />
      </main>

      <RecallModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
        requestId={requestId!}
      />

      <DocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
      />

      <SendForSigningModal
        isOpen={isSendForSigningModalOpen}
        onClose={() => setIsSendForSigningModalOpen(false)}
      />
    </motion.div>
  );
}
