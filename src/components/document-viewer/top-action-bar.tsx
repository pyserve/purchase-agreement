import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Document } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PenTool, Plus, RefreshCw, Send, Undo2 } from "lucide-react";
import { useState } from "react";

interface TopActionBarProps {
  selectedDocument?: Document;
  onRecallClick: () => void;
  onAddDocumentsClick: () => void;
  onSendForSigningClick: () => void;
}

export default function TopActionBar({
  // selectedDocument,
  onRecallClick,
  onAddDocumentsClick,
  onSendForSigningClick,
}: TopActionBarProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startSigningMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/start-signing"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Signing process started successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start signing process",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleStartSigning = () => {
    startSigningMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white px-6">
      <div className="flex w-full items-center justify-between">
        {/* Left: Title and Status */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Preview and Send Agreement
          </h1>
          <div className="flex items-center space-x-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-blue-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-gray-600">Ready for Review</span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {/* Recall Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRecallClick}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <Undo2 className="h-4 w-4" />
            <span>Recall</span>
          </Button>

          {/* Add Documents Button */}
          <Button variant="outline" size="sm" onClick={onAddDocumentsClick}>
            <Plus className="h-4 w-4" />
            Add Documents
          </Button>

          {/* Primary Action Buttons */}
          <Button
            onClick={onSendForSigningClick}
            className="bg-blue-500 text-white shadow-sm hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
            Send for Signing
          </Button>

          <Button
            onClick={handleStartSigning}
            disabled={startSigningMutation.isPending}
            className="bg-green-600 text-white shadow-sm hover:bg-green-700"
          >
            <PenTool className="h-4 w-4" />
            {startSigningMutation.isPending
              ? "Starting..."
              : "Start Signing Now"}
          </Button>
        </div>
      </div>
    </header>
  );
}
