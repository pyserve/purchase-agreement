import { useZoho } from "@/providers/zoho-provider";
import { invokeConnection } from "@/repo";
import { useDataStore } from "@/store/useDataStore";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { DocumentID } from "@/types/sign";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function DocumentPreview({ doc }: { doc: DocumentID }) {
  const { dataProvider } = useZoho();
  const { requestId } = useDocumentsStore();
  const { lead } = useDataStore();

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await invokeConnection<string>({
        dataProvider,
        params: {
          method: "GET",
          url: `https://sign.zoho.com/api/v1/requests/${requestId}/documents/${doc.document_id}/pdf`,
          parameters: {},
          connection: "zohosign",
        },
      });

      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Purchase Agreement - ${lead?.CX_Profile?.name ?? ""} ${doc.document_name ?? ""}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => toast.error(error?.message || "Download failed"),
  });

  return (
    <div className="group relative w-32" key={doc.document_name}>
      <div className="mb-2 aspect-[8.5/11] overflow-hidden rounded bg-gray-50 shadow-sm">
        <img
          src={`data:image/png;base64,${doc.image_string}`}
          alt={doc.document_name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-center text-sm font-medium text-gray-900">
        {doc.document_name}
      </p>
      <p className="text-center text-xs text-gray-500">{`${doc.total_pages} page${doc.total_pages == 1 ? "" : "s"}`}</p>

      <div className="absolute top-1 right-1 opacity-0 transition-all group-hover:opacity-100">
        <Button
          size="icon"
          variant="outline"
          onClick={() => downloadMutation.mutate()}
        >
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
}
