import axios, { type AxiosResponse } from "axios";

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
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
  },
);

export async function apiRequest<T>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<AxiosResponse> {
  return await axios<T>({
    method,
    url,
    data,
  });
}
