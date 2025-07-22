import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useZoho } from "@/providers/zoho-provider";
import { executeFunction } from "@/repo";
import type { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export default function DocumentDisplay({
  agreementDocument,
  document,
}: {
  agreementDocument?: string;
  document?: Document;
}) {
  const { dataProvider } = useZoho();

  const containerRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const estimatedHeight = useMemo(() => {
    if (isLoaded) {
      const width = Number(containerRef.current?.clientWidth ?? 0);
      return width * 1.414 * 10;
    }
    return 600;
  }, [isLoaded]);

  const documentDetails = useQuery({
    enabled: !!document,
    queryKey: ["documentDetails", document?.name],
    queryFn: async () => {
      if (document?.name == "Agreement") return agreementDocument;

      if (!document?.templateName) {
        throw new Error(`${document?.name} Template Not Available`);
      }

      return await executeFunction({
        dataProvider,
        params: {
          name: "download_mail_merge_template",
          params: {
            module_name: document?.module,
            record_id: document?.recordId,
            template_name: document?.templateName,
          },
        },
      });
    },
  });

  if (!document) {
    return (
      <section className="flex flex-1 items-center justify-center bg-gray-100 p-6">
        <div className="text-center">
          <p className="mb-4 text-gray-500">No document selected</p>
          <p className="text-sm text-gray-400">
            Select a document from the sidebar to view it
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="flex min-h-[calc(100vh-4em)] flex-1 flex-col bg-gray-100 p-0 md:p-6"
      ref={containerRef}
    >
      {/* Single Image Display */}
      <div className="flex flex-1 justify-center">
        <Card className="w-full max-w-4xl overflow-hidden rounded-none bg-white p-0 shadow-lg md:rounded-md">
          <div className="relative">
            <AnimatePresence mode="sync">
              {documentDetails.isFetching && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex h-[600px] items-center justify-center bg-gray-100"
                >
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading document...</p>
                  </div>
                </motion.div>
              )}

              {documentDetails.error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex h-[600px] items-center justify-center bg-gray-100"
                >
                  <div className="text-center">
                    <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <h4 className="mb-2 text-lg font-medium text-gray-900">
                      Unable to load document
                    </h4>
                    <p className="mb-4 max-w-xl text-gray-600">
                      {documentDetails.error.message}
                    </p>
                    <Button
                      onClick={() => documentDetails.refetch()}
                      variant="outline"
                    >
                      Retry
                    </Button>
                  </div>
                </motion.div>
              )}

              {documentDetails.data ? (
                <motion.iframe
                  key={document.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={`https://workdrive.zohoexternal.com/embed/${documentDetails.data}?toolbar=false&appearance=light&themecolor=green`}
                  allowFullScreen
                  onLoad={() => setIsLoaded(true)}
                  width="100%"
                  height={estimatedHeight}
                />
              ) : (
                <></>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </section>
  );
}
