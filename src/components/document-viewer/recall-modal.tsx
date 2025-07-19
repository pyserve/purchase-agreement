import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RecallModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

export default function RecallModal({
  isOpen,
  onClose,
  requestId,
}: RecallModalProps) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const recallMutation = useMutation({
    mutationFn: (data: { requestId: string; reason: string }) =>
      apiRequest("POST", "/api/recall-requests", data),
    onSuccess: () => {
      toast.success("Document Recalled", {
        description:
          "The document has been recalled successfully. All parties have been notified.",
      });
      setReason("");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to recall document. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast("Reason Required", {
        description: "Please provide a reason for recalling this document.",
      });
      return;
    }
    recallMutation.mutate({ requestId, reason: reason.trim() });
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Recall Document</DialogTitle>
          <DialogDescription className="text-center">
            Please provide a reason for recalling this document. This action
            will notify all parties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for recall</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for recalling this document..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={recallMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={recallMutation.isPending}
            >
              {recallMutation.isPending ? "Recalling..." : "Recall Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
