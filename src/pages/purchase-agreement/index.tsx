import DocumentDisplay from "@/components/document-viewer/document-display";
import DocumentsModal from "@/components/document-viewer/documents-modal";
import RecallModal from "@/components/document-viewer/recall-modal";
import ThumbnailSidebar from "@/components/document-viewer/thumbnail-sidebar";
import TopActionBar from "@/components/document-viewer/top-action-bar";
import type { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function PurchaseAgreement() {
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
    isLoading,
    error,
  } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center ">
          <Loader2Icon className="animate-spin mx-auto  h-8 w-8 text-blue-500" />
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error || !Array.isArray(documents)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load documents</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedDocument = documents?.find(
    (doc) => doc.id === selectedDocumentId
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <TopActionBar
        selectedDocument={selectedDocument}
        depositEnabled={depositEnabled}
        onDepositToggle={() => setDepositEnabled(!depositEnabled)}
        onRecallClick={() => setIsRecallModalOpen(true)}
        onAddDocumentsClick={() => setIsDocumentsModalOpen(true)}
      />

      <main className="flex-1 flex">
        <ThumbnailSidebar
          documents={documents || []}
          selectedDocumentId={selectedDocumentId}
          onDocumentSelect={setSelectedDocumentId}
        />

        <DocumentDisplay
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
