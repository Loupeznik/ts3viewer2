import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/api";
import { revokeToken } from "@/helpers/TokenProvider";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        revokeToken();
        window.location.href = "/admin";
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
