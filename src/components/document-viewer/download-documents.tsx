import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useZoho } from "@/providers/zoho-provider";
import { invokeConnection } from "@/repo";
import { useDataStore } from "@/store/useDataStore";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

export function DownloadDocumentButton() {
  const { dataProvider } = useZoho();
  const { requestId } = useDocumentsStore();
  const { lead } = useDataStore();
  const isMobile = useIsMobile();

  const downloadDocuments = useMutation({
    mutationFn: async () => {
      return await invokeConnection<string>({
        dataProvider,
        params: {
          method: "GET",
          url: `https://sign.zoho.com/api/v1/requests/${requestId}/pdf?with_coc=true`,
          parameters: {},
          connection: "zohosign",
        },
      });
    },
    onSuccess: (res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Purchase Agreement - ${lead?.CX_Profile?.name ?? ""}.zip`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => toast.error(error?.message || "Download failed"),
  });

  return (
    <Button
      onClick={() => downloadDocuments.mutate()}
      disabled={downloadDocuments.isPending}
      className="bg-green-600 text-white hover:bg-green-700"
    >
      {downloadDocuments.isPending ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : (
        <DownloadIcon className="h-4 w-4" />
      )}
      {isMobile ? "Download" : "Download Documents"}
    </Button>
  );
}
