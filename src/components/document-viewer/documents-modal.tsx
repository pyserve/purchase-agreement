import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Document } from "@/types/document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { useState } from "react";

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentsModal({
  isOpen,
  onClose,
}: DocumentsModalProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableDocuments0, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/available-documents"],
    enabled: isOpen,
  });

  const availableDocuments = [
    { id: 10, name: "voluptate" },
    { id: 20, name: "voluptate" },
  ];

  const updateDocumentMutation = useMutation({
    mutationFn: (data: { id: number; isSelected: boolean }) =>
      apiRequest("PATCH", `/api/available-documents/${data.id}`, {
        isSelected: data.isSelected,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/available-documents"] });
    },
  });

  const handleDocumentToggle = (documentId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, documentId]);
    } else {
      setSelectedDocuments((prev) => prev.filter((id) => id !== documentId));
    }
  };

  const handleAddSelected = async () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to add.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update all selected documents
      await Promise.all(
        selectedDocuments.map((id) =>
          updateDocumentMutation.mutateAsync({ id, isSelected: true })
        )
      );

      toast({
        title: "Documents Added",
        description: `${selectedDocuments.length} document${
          selectedDocuments.length === 1 ? "" : "s"
        } added to the agreement package.`,
      });

      setSelectedDocuments([]);
      onClose();
    } catch (error) {
      console.log("🚀 ~ handleAddSelected ~ error:", error);
      toast({
        title: "Error",
        description: "Failed to add documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setSelectedDocuments([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl max-h-[80vh] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Documents</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Select additional documents to include in this agreement package.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {availableDocuments?.map((document, index) => (
                <motion.div
                  key={document.id}
                  // initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={(checked) =>
                        handleDocumentToggle(document.id, checked as boolean)
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
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedDocuments.length} document
              {selectedDocuments.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={updateDocumentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={
                  updateDocumentMutation.isPending ||
                  selectedDocuments.length === 0
                }
              >
                {updateDocumentMutation.isPending
                  ? "Adding..."
                  : "Add Selected"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
