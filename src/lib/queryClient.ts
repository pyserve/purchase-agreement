import { QueryClient, type QueryFunction } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosResponse } from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error ||
        error.response.statusText ||
        "Request failed";
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: No response received");
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<AxiosResponse> {
  return await axios({
    method,
    url,
    data,
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const response = await axios.get(queryKey.join("/") as string);
      return response.data;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        unauthorizedBehavior === "returnNull" &&
        error.response?.status === 401
      ) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
