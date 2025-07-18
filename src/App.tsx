import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PurchaseAgreement from "@/pages/purchase-agreement";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<PurchaseAgreement />} />
      <Route element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
