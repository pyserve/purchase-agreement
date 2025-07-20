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
import { useZoho } from "@/providers/zoho-provider";
import { recallAgreement } from "@/repo/purchase-agreement/recallAgreement";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface RecallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecallModal({ isOpen, onClose }: RecallModalProps) {
  const { dataProvider } = useZoho();
  const { requestId, setRequestId } = useDocumentsStore();

  const [reason, setReason] = useState("");

  const recall = useMutation({
    mutationFn: async (reason: string) => {
      if (!reason) {
        throw Error("Reason Required");
      }
      return await recallAgreement({ dataProvider, requestId, reason });
    },
    onSuccess: () => {
      toast.success("Document has been recalled");
      setRequestId(null);
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recall.mutate(reason.trim());
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
              disabled={recall.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={recall.isPending}
            >
              {recall.isPending ? "Recalling..." : "Recall Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
