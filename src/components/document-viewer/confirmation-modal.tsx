import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useZoho } from "@/providers/zoho-provider";
import { useSendForSigning } from "@/repo/purchase-agreement/useSendForSigning";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { Document } from "@/types/document";
import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckIcon,
  Mail,
  MessageCircle,
  PenTool,
  Phone,
  Send,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";

interface ConfirmationModalProps {
  isEmbeddedSigning: boolean;
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  salesOrder: SalesOrder;
  lead: Lead;
  documentTemplates: Document[];
}

export default function ConfirmationModal({
  isEmbeddedSigning,
  isOpen,
  onClose,
  lead,
  salesOrder,
  documentTemplates,
}: ConfirmationModalProps) {
  const { dataProvider } = useZoho();
  const { setRequestId } = useDocumentsStore();

  const [requestDeposit, setRequestDeposit] = useState(
    !salesOrder.Deposit_Paid,
  );
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "phone">(
    "email",
  );

  const [signUrl, setSignUrl] = useState<string>();
  const [fakeProgress, setFakeProgress] = useState(0);
  const fakeInterval = useRef<any>(null);

  const customerName = lead.CX_Profile?.name;
  const customerEmail = lead.Email;
  const customerPhone = lead.Mobile;

  const sendForSigning = useSendForSigning({
    dataProvider,
    salesOrderId: salesOrder.id,
    templates: documentTemplates,
  });

  const triggerFakeProgress = () => {
    setFakeProgress(0);

    fakeInterval.current = setInterval(() => {
      setFakeProgress((prev) => {
        const step = 80 / documentTemplates.length;
        const next = Math.min(prev + step, 80);
        if (next === 80) {
          clearInterval(fakeInterval.current);
        }
        return next;
      });
    }, 2500);
  };

  useEffect(() => {
    sendForSigning.reset();
    setFakeProgress(0);
  }, [isOpen]);

  useEffect(() => {
    if (sendForSigning.isSuccess || sendForSigning.isError) {
      clearInterval(fakeInterval.current);
      setFakeProgress(100);
    }
  }, [sendForSigning.isSuccess, sendForSigning.isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      triggerFakeProgress();
      const res = await sendForSigning.mutateAsync({
        isEmbeddedSigning,
        requestDeposit,
        sendToPhone: deliveryMethod == "phone",
        phoneNumber: customerPhone,
      });
      setSignUrl(res.sign_url);
      setRequestId(res.request_id);

      if (isEmbeddedSigning) {
        window.open(res.sign_url, "_blank");
      }
    } catch (error) {}
  };

  const handleClose = () => {
    onClose();
  };

  const renderForm = () => {
    return (
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
        {!isEmbeddedSigning && (
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
        )}

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
                  Turn off if deposit is paid or not needed at signing
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
          >
            Cancel
          </Button>
          {isEmbeddedSigning ? (
            <Button
              type="submit"
              className="min-h-[44px] flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <PenTool className="h-4 w-4" />
              Start Signing
            </Button>
          ) : (
            <Button
              type="submit"
              className="min-h-[44px] flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Send for Signing
            </Button>
          )}
        </div>
      </form>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="mx-auto max-h-[95vh] w-[95vw] max-w-md overflow-y-auto"
        onEscapeKeyDown={(e) => sendForSigning.isPending && e.preventDefault()}
        onPointerDownOutside={(e) =>
          sendForSigning.isPending && e.preventDefault()
        }
        showCloseButton={!sendForSigning.isPending}
      >
        <DialogHeader>
          {!sendForSigning.isIdle && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => sendForSigning.reset()}
              disabled={!sendForSigning.isError}
              hidden
            >
              <ArrowLeftIcon />
            </Button>
          )}

          {sendForSigning.isSuccess ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
              <CheckIcon className="h-6 w-6 text-white" />
            </div>
          ) : isEmbeddedSigning ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <PenTool className="h-6 w-6 text-green-600" />
            </div>
          ) : (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          )}

          <DialogTitle className="text-center text-lg">
            {sendForSigning.isSuccess
              ? "Success"
              : isEmbeddedSigning
                ? "Start Signing Now"
                : "Send for Signing"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {sendForSigning.isSuccess
              ? isEmbeddedSigning
                ? "The agreement has been generated successfully"
                : "The agreement has been sent successfully"
              : isEmbeddedSigning
                ? "The purchase agreement will open in a new window"
                : "The purchase agreement will be sent to the customer"}
          </DialogDescription>
        </DialogHeader>

        {sendForSigning.isIdle ? (
          <div>{renderForm()}</div>
        ) : sendForSigning.isSuccess ||
          sendForSigning.isPending ||
          sendForSigning.isError ? (
          <div className="space-y-4 pb-8">
            <div className="mb-4 space-y-4">
              {sendForSigning.isPending && (
                <p className="text-sm">Generating documents. Please wait...</p>
              )}

              <Progress
                value={fakeProgress}
                indicatorColor={
                  sendForSigning.isError
                    ? "bg-red-600"
                    : sendForSigning.isSuccess
                      ? "bg-green-600"
                      : null
                }
                indicatorBgColor={
                  sendForSigning.isError
                    ? "bg-red-600/10"
                    : sendForSigning.isSuccess
                      ? "bg-green-600/10"
                      : null
                }
              />
            </div>

            {sendForSigning.isError && (
              <Alert variant="destructive">
                <AlertTriangleIcon />
                <AlertTitle>Error</AlertTitle>

                <AlertDescription>
                  {sendForSigning.error?.message}
                </AlertDescription>
              </Alert>
            )}
            {sendForSigning.isSuccess && (
              <Button className="w-full" variant="outline" onClick={onClose}>
                View Documents
              </Button>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </DialogContent>
    </Dialog>
  );
}
