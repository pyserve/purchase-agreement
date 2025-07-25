import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import useTimeAgo from "@/hooks/use-time-ago";
import { useZoho } from "@/providers/zoho-provider";
import { useAgreementRequestStatus } from "@/repo/purchase-agreement/useAgreementRequestStatus";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import {
  FilePenIcon,
  PenTool,
  Plus,
  RefreshCw,
  Send,
  Undo2,
} from "lucide-react";
import { DownloadDocumentButton } from "./download-documents";

interface TopActionBarProps {
  onRecallClick: () => void;
  onAddDocumentsClick: () => void;
  onSendForSigningClick: () => void;
  onSignNowClick: () => void;
}

export default function TopActionBar({
  onRecallClick,
  onAddDocumentsClick,
  onSendForSigningClick,
  onSignNowClick,
}: TopActionBarProps) {
  const { dataProvider } = useZoho();
  const { requestId, setRequestId } = useDocumentsStore();

  const agreementStatus = useAgreementRequestStatus({
    dataProvider,
    requestId,
  });

  const isMobile = useIsMobile();

  const timeAgo = useTimeAgo(agreementStatus.dataUpdatedAt);

  return (
    <header className="sticky top-0 z-10 flex h-24 items-center overflow-hidden border-b border-gray-200 bg-white px-2 md:h-16 md:px-6">
      <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
        {/* Left: Title and Status */}
        <div className="flex flex-1 items-center space-x-4">
          <h1 className="w-full text-center text-xl font-semibold text-gray-900 md:text-left">
            Preview and Send Agreement
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {agreementStatus.data?.request_status == "inprogress" ||
          agreementStatus.data?.request_status == "completed" ? (
            <>
              {/* Refresh Button */}

              <div className="text-muted-foreground text-xs md:text-sm">
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

              {/* Recall Button: Cannot recall if document already signed */}
              {agreementStatus.data.request_status !== "completed" && (
                <Button
                  variant="outline"
                  onClick={onRecallClick}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Undo2 className="h-4 w-4" />
                  {isMobile ? "Recall" : "Recall Agreement"}
                </Button>
              )}

              {agreementStatus.data.request_status === "completed" && (
                <Button onClick={() => setRequestId(null)}>
                  <FilePenIcon />
                  Send New Agreement
                </Button>
              )}

              <DownloadDocumentButton />
            </>
          ) : (
            <>
              {/* Add Documents Button */}
              <Button variant="outline" onClick={onAddDocumentsClick}>
                <Plus className="h-4 w-4" />
                {isMobile ? "Add" : "Add Documents"}
              </Button>

              {/* Primary Action Buttons */}
              <Button onClick={onSendForSigningClick}>
                <Send className="hidden h-4 w-4 sm:block" />
                Send for Signing
              </Button>

              <Button
                onClick={onSignNowClick}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <PenTool className="hidden h-4 w-4 sm:block" />
                Start Signing Now
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
