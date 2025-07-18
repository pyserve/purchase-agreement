import { Card } from "@/components/ui/card";
import type { Document } from "@/types/document";
import { motion } from "framer-motion";

interface ThumbnailSidebarProps {
  documents: Document[];
  selectedDocumentId: number;
  onDocumentSelect: (id: number) => void;
}

export default function ThumbnailSidebar({
  documents,
  selectedDocumentId,
  onDocumentSelect,
}: ThumbnailSidebarProps) {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-500 mt-1">
          {documents.length} {documents.length === 1 ? "page" : "pages"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedDocumentId === document.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onDocumentSelect(document.id)}
              >
                <div className="p-3">
                  <div className="aspect-[8.5/11] bg-gray-100 rounded shadow-sm overflow-hidden mb-2">
                    <img
                      src={document.imageUrl}
                      alt={document.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
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
