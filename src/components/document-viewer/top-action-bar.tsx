import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Document } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PenTool, Plus, RefreshCw, Send, Undo2 } from "lucide-react";
import { useState } from "react";

interface TopActionBarProps {
  selectedDocument?: Document;
  depositEnabled: boolean;
  onDepositToggle: () => void;
  onRecallClick: () => void;
  onAddDocumentsClick: () => void;
}

export default function TopActionBar({
  // selectedDocument,
  depositEnabled,
  onDepositToggle,
  onRecallClick,
  onAddDocumentsClick,
}: TopActionBarProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sendForSigningMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/send-for-signing"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document sent for signing successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send document for signing",
        variant: "destructive",
      });
    },
  });

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

  const handleSendForSigning = () => {
    sendForSigningMutation.mutate();
  };

  const handleStartSigning = () => {
    startSigningMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and Status */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Preview and Send Agreement
          </h1>
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
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
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {/* Request Security Deposit Toggle */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700">
                Request security deposit
              </label>
              <p className="text-xs text-gray-500">Enable deposit collection</p>
            </div>
            <Switch
              checked={depositEnabled}
              onCheckedChange={onDepositToggle}
            />
          </div>

          {/* Recall Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRecallClick}
            className="text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Recall
          </Button>

          {/* Add Documents Button */}
          <Button variant="outline" size="sm" onClick={onAddDocumentsClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Documents
          </Button>

          {/* Primary Action Buttons */}
          <Button
            onClick={handleSendForSigning}
            disabled={sendForSigningMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {sendForSigningMutation.isPending
              ? "Sending..."
              : "Send for Signing"}
          </Button>

          <Button
            onClick={handleStartSigning}
            disabled={startSigningMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            <PenTool className="h-4 w-4 mr-2" />
            {startSigningMutation.isPending
              ? "Starting..."
              : "Start Signing Now"}
          </Button>
        </div>
      </div>
    </header>
  );
}
