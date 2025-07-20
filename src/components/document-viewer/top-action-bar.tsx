import { Button } from "@/components/ui/button";
import useTimeAgo from "@/hooks/use-time-ago";
import { useZoho } from "@/providers/zoho-provider";
import { useAgreementRequestStatus } from "@/repo/purchase-agreement/useAgreementRequestStatus";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { Download, PenTool, Plus, RefreshCw, Send, Undo2 } from "lucide-react";

interface TopActionBarProps {
  isSignedOrSigning: boolean;
  onRecallClick: () => void;
  onAddDocumentsClick: () => void;
  onSendForSigningClick: () => void;
  onSignNowClick: () => void;
}

export default function TopActionBar({
  isSignedOrSigning,
  onRecallClick,
  onAddDocumentsClick,
  onSendForSigningClick,
  onSignNowClick,
}: TopActionBarProps) {
  const { dataProvider } = useZoho();
  const { requestId } = useDocumentsStore();

  const agreementStatus = useAgreementRequestStatus({
    dataProvider,
    requestId,
  });

  const timeAgo = useTimeAgo(agreementStatus.dataUpdatedAt);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white px-6">
      <div className="flex w-full items-center justify-between">
        {/* Left: Title and Status */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Preview and Send Agreement
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {isSignedOrSigning ? (
            <>
              {/* Refresh Button */}

              <div className="text-muted-foreground text-sm">
                Last Updated: {timeAgo.data}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => agreementStatus.refetch()}
                disabled={agreementStatus.isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${agreementStatus.isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              {/* Recall Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onRecallClick}
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                <Undo2 className="h-4 w-4" />
                <span>Recall</span>
              </Button>

              <Button onClick={onSendForSigningClick}>
                <Download className="h-4 w-4" />
                Download Documents
              </Button>
            </>
          ) : (
            <>
              {/* Add Documents Button */}
              <Button variant="outline" onClick={onAddDocumentsClick}>
                <Plus className="h-4 w-4" />
                Add Documents
              </Button>

              {/* Primary Action Buttons */}
              <Button onClick={onSendForSigningClick}>
                <Send className="h-4 w-4" />
                Send for Signing
              </Button>

              <Button
                onClick={onSignNowClick}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <PenTool className="h-4 w-4" />
                Start Signing Now
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
