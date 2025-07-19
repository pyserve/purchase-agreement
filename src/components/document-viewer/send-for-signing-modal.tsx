import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, Send, Shield, User } from "lucide-react";
import { useState } from "react";

interface SendForSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
}

export default function SendForSigningModal({
  isOpen,
  onClose,
  documentTitle = "Purchase Agreement",
}: SendForSigningModalProps) {
  const [requestDeposit, setRequestDeposit] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "phone">(
    "email",
  );

  // Customer details (would come from props or context in real app)
  const customerName = "John Smith";
  const customerEmail = "john.smith@example.com";
  const customerPhone = "(555) 123-4567";
  const { toast } = useToast();

  const sendForSigningMutation = useMutation({
    mutationFn: (data: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      requestDeposit: boolean;
      deliveryMethod: "email" | "phone";
    }) => apiRequest("POST", "/api/send-for-signing", data),
    onSuccess: () => {
      toast({
        title: "Document Sent Successfully",
        description: `${documentTitle} has been sent to ${customerName} for signing.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send document for signing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendForSigningMutation.mutate({
      customerName,
      customerEmail,
      customerPhone,
      requestDeposit,
      deliveryMethod,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="mx-auto max-h-[95vh] w-[95vw] max-w-md overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Send className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-lg">
            Send for Signing
          </DialogTitle>
          {/* <DialogDescription className="text-center text-sm">
            Configure signing details for {documentTitle}
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          {/* Customer Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <User className="h-4 w-4" />
              <span>Customer Details</span>
            </div>

            <div className="space-y-2 pl-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <Label className="text-xs text-gray-600">Full Name</Label>
                <span className="text-sm font-medium text-gray-900">
                  {customerName}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <Label className="text-xs text-gray-600">Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {customerEmail}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <Label className="text-xs text-gray-600">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {customerPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <MessageCircle className="h-4 w-4" />
              <span>Delivery Method</span>
            </div>

            <div className="space-y-2 pl-6">
              <label
                className={`flex cursor-pointer touch-none items-center justify-between rounded-lg border-2 p-3 transition-all duration-200 select-none ${
                  deliveryMethod === "email"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDeliveryMethod("email")}
              >
                <div className="flex items-center space-x-3">
                  <Mail
                    className={`h-4 w-4 ${deliveryMethod === "email" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <div>
                    <div
                      className={`text-sm font-medium ${deliveryMethod === "email" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Email
                    </div>
                    <p
                      className={`text-xs ${deliveryMethod === "email" ? "text-blue-700" : "text-gray-500"}`}
                    >
                      Send via email notification
                    </p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    deliveryMethod === "email"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryMethod === "email" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === "email"}
                  onChange={() => setDeliveryMethod("email")}
                  className="sr-only"
                />
              </label>

              <label
                className={`flex cursor-pointer touch-none items-center justify-between rounded-lg border-2 p-3 transition-all duration-200 select-none ${
                  deliveryMethod === "phone"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDeliveryMethod("phone")}
              >
                <div className="flex items-center space-x-3">
                  <Phone
                    className={`h-4 w-4 ${deliveryMethod === "phone" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <div>
                    <div
                      className={`text-sm font-medium ${deliveryMethod === "phone" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      SMS
                    </div>
                    <p
                      className={`text-xs ${deliveryMethod === "phone" ? "text-blue-700" : "text-gray-500"}`}
                    >
                      Send via text message
                    </p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    deliveryMethod === "phone"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryMethod === "phone" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === "phone"}
                  onChange={() => setDeliveryMethod("phone")}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Security Deposit Option */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Shield className="h-4 w-4" />
              <span>Security Deposit</span>
            </div>

            <div className="pl-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Request security deposit
                  </label>
                  <p className="text-xs text-gray-500">
                    Collect deposit before signing
                  </p>
                </div>
                <Switch
                  checked={requestDeposit}
                  onCheckedChange={setRequestDeposit}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 flex flex-col gap-3 bg-white pt-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="min-h-[44px] flex-1"
              disabled={sendForSigningMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-h-[44px] flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={sendForSigningMutation.isPending}
            >
              {sendForSigningMutation.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send for Signing
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
