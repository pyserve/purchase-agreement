import { Card } from "@/components/ui/card";
import type { Document, DocumentType } from "@/types/document";
import { motion } from "framer-motion";

interface ThumbnailSidebarProps {
  documents: Document[];
  selectedDocumentType?: string | null;
  onDocumentSelect: (type?: DocumentType) => void;
}

export default function ThumbnailSidebar({
  documents,
  selectedDocumentType,
  onDocumentSelect,
}: ThumbnailSidebarProps) {
  return (
    <aside className="sticky top-16 flex h-full w-32 flex-col border-r border-gray-200 bg-white md:w-48">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-500">
          {documents.length} {documents.length === 1 ? "document" : "documents"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              // initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer rounded-md p-3 transition-all duration-200 hover:shadow-md ${
                  selectedDocumentType === document.documentType
                    ? "bg-blue-50 ring-2 ring-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onDocumentSelect(document.documentType)}
              >
                <div>
                  {document.thumbnail && (
                    <div className="mb-2 aspect-[8.5/11] overflow-hidden rounded bg-gray-100 shadow-sm">
                      <img
                        src={document.thumbnail}
                        alt={document.documentType}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-100"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {document.documentType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {/* Page {document.pageNumber} of {document.totalPages} */}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
