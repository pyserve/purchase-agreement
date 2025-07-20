import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

export default function useTimeAgo(date?: number) {
  return useQuery<string>({
    enabled: !!date,
    queryKey: ["time-ago", date],
    refetchInterval: 5000,
    queryFn: () => (date ? format(date) : ""),
  });
}
