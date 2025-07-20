import type { SignDocumentStatus } from "@/types/sign";
import type { ZohoDataProvider } from "@/types/zoho";
import { useQuery } from "@tanstack/react-query";
import { invokeConnection } from "..";

export function useAgreementRequestStatus({
  dataProvider,
  requestId,
}: {
  dataProvider: ZohoDataProvider;
  requestId?: string | null;
}) {
  return useQuery({
    enabled: !!requestId,
    queryKey: ["agreementRequestStatus", requestId],
    queryFn: async () => {
      const res = await invokeConnection<SignDocumentStatus>({
        dataProvider,
        params: {
          method: "GET",
          url: `https://sign.zoho.com/api/v1/requests/${requestId}`,
          parameters: {},
          connection: "zohosign",
        },
      });
      return res.statusMessage?.requests;
    },
  });
}
