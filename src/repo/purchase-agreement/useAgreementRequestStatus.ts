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
  return useQuery<any>({
    enabled: !!requestId,
    queryKey: ["agreementRequestStatus", requestId],
    queryFn: async () => {
      return invokeConnection({
        dataProvider,
        params: {
          method: "GET",
          url: `https://sign.zoho.com/api/v1/requests/${requestId}`,
          parameters: {},
          connection: "zohosign",
        },
      });
    },
  });
}
