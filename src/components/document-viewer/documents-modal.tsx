import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDocumentTemplates } from "@/constants/documents";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { Dealer } from "@/types/dealer";
import {
  DOCUMENT_LIST,
  type Document,
  type DocumentName,
} from "@/types/document";
import { motion } from "framer-motion";
import { AlertTriangleIcon, FileText, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer?: Dealer;
}

export default function DocumentsModal({
  isOpen,
  onClose,
  dealer,
}: DocumentsModalProps) {
  const { documents, setDocuments } = useDocumentsStore();
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentName[]>(
    [],
  );

  useEffect(() => {
    // Reset selected documents when modal opens
    if (isOpen) {
      setSelectedDocuments(documents ?? []);
    }
  }, [isOpen]);

  const documentTemplates: Document[] = useMemo(() => {
    if (dealer) {
      const dealerDocuments = getDocumentTemplates(dealer);

      return DOCUMENT_LIST.map((v) => {
        const template = dealerDocuments.find((d) => d.name === v);
        if (template) {
          return template;
        } else {
          return {
            name: v,
          };
        }
      });
    } else {
      return [];
    }
  }, [dealer, documents]);

  const handleDocumentToggle = (name: DocumentName, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, name]);
    } else {
      setSelectedDocuments((prev) => prev.filter((v) => v !== name));
    }
  };

  const handleSaveChanges = async () => {
    setDocuments(selectedDocuments);

    toast.info("Changes Saved", {
      description: `${selectedDocuments.length} document${
        selectedDocuments.length === 1 ? "" : "s"
      } added to the agreement package.`,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="flex max-h-[80vh] flex-col sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Documents</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Select documents to be included in this agreement package.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-3">
            {documentTemplates
              ?.filter((document) => document.name)
              ?.map((document, index) => (
                <motion.div
                  key={document.name}
                  // initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50">
                    <Checkbox
                      checked={selectedDocuments.includes(document.name!)}
                      onCheckedChange={(checked) =>
                        handleDocumentToggle(document.name!, checked as boolean)
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {document.name}
                            </p>

                            {document.name != "Agreement" &&
                              !document.templateName && (
                                <div className="flex items-center gap-x-1 space-x-1 text-xs text-yellow-600">
                                  <AlertTriangleIcon className="h-4 w-4" />
                                  No template available for {dealer}
                                </div>
                              )}
                            <p className="text-xs text-gray-500">
                              {/* {document.description} • {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'} */}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {/* PDF • {document.fileSize} */}
                        </div>
                      </div>
                    </div>
                  </label>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedDocuments.length} document
              {selectedDocuments.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={selectedDocuments.length === 0}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
