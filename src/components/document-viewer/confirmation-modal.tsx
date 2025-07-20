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
import { sleep } from "@/lib/utils";
import { useZoho } from "@/providers/zoho-provider";
import { sendPurchaseAgreement } from "@/repo/purchase-agreement/sendPurchaseAgreement";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import type { Document } from "@/types/document";
import type { Lead } from "@/types/lead";
import type { SalesOrder } from "@/types/sales-order";
import type { DeliveryMethod } from "@/types/sign";
import { useMutation } from "@tanstack/react-query";
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
import toast from "react-hot-toast";
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
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("EMAIL");

  const [fakeProgress, setFakeProgress] = useState(0);
  const fakeInterval = useRef<any>(null);

  const customerName = lead.CX_Profile?.name;
  const customerEmail = lead.Email;
  const customerPhone = lead.Mobile;

  const generateAndSign = useMutation({
    mutationFn: async () => {
      return await sendPurchaseAgreement({
        dataProvider,
        salesOrderId: salesOrder.id,
        templates: documentTemplates,
        isEmbeddedSigning,
        deliveryMethod,
        requestDeposit,
        phoneNumber: customerPhone,
      });
    },
    onSuccess: async (res) => {
      clearInterval(fakeInterval.current);
      setFakeProgress(100);

      if (isEmbeddedSigning) {
        toast.success("The purchase agreement will open in a new window.", {
          duration: 5000,
        });
      } else {
        toast.success(
          "The agreement has been generated and sent to the customer.",
          { duration: 5000 },
        );
      }

      await sleep(1000);

      onClose();
      setRequestId(res.request_id);

      if (isEmbeddedSigning) {
        window.open(res.sign_url, "_blank");
      }
    },
    onError: () => {
      clearInterval(fakeInterval.current);
      setFakeProgress(100);
    },
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
    generateAndSign.reset();
    setFakeProgress(0);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerFakeProgress();
    generateAndSign.mutate();
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
                  deliveryMethod === "EMAIL"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDeliveryMethod("EMAIL")}
              >
                <div className="flex items-center space-x-3">
                  <Mail
                    className={`h-4 w-4 ${deliveryMethod === "EMAIL" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <div>
                    <div
                      className={`text-sm font-medium ${deliveryMethod === "EMAIL" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Email
                    </div>
                    <p
                      className={`text-xs ${deliveryMethod === "EMAIL" ? "text-blue-700" : "text-gray-500"}`}
                    >
                      Send via email notification
                    </p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    deliveryMethod === "EMAIL"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryMethod === "EMAIL" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === "EMAIL"}
                  onChange={() => setDeliveryMethod("EMAIL")}
                  className="sr-only"
                />
              </label>

              <label
                className={`flex cursor-pointer touch-none items-center justify-between rounded-lg border-2 p-3 transition-all duration-200 select-none ${
                  deliveryMethod === "EMAIL_SMS"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDeliveryMethod("EMAIL_SMS")}
              >
                <div className="flex items-center space-x-3">
                  <Phone
                    className={`h-4 w-4 ${deliveryMethod === "EMAIL_SMS" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <div>
                    <div
                      className={`text-sm font-medium ${deliveryMethod === "EMAIL_SMS" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Email and SMS
                    </div>
                    <p
                      className={`text-xs ${deliveryMethod === "EMAIL_SMS" ? "text-blue-700" : "text-gray-500"}`}
                    >
                      Send via email and text message
                    </p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    deliveryMethod === "EMAIL_SMS"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryMethod === "EMAIL_SMS" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === "EMAIL_SMS"}
                  onChange={() => setDeliveryMethod("EMAIL_SMS")}
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
        onEscapeKeyDown={(e) => generateAndSign.isPending && e.preventDefault()}
        onPointerDownOutside={(e) =>
          generateAndSign.isPending && e.preventDefault()
        }
        showCloseButton={!generateAndSign.isPending}
      >
        <DialogHeader>
          {!generateAndSign.isIdle && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => generateAndSign.reset()}
              disabled={!generateAndSign.isError}
              hidden
            >
              <ArrowLeftIcon />
            </Button>
          )}

          {generateAndSign.isSuccess ? (
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
            {generateAndSign.isSuccess
              ? "Success"
              : isEmbeddedSigning
                ? "Start Signing Now"
                : "Send for Signing"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {isEmbeddedSigning
              ? "The purchase agreement will open in a new window"
              : "The purchase agreement will be sent to the customer"}
          </DialogDescription>
        </DialogHeader>

        {generateAndSign.isIdle ? (
          <div>{renderForm()}</div>
        ) : generateAndSign.isSuccess ||
          generateAndSign.isPending ||
          generateAndSign.isError ? (
          <div className="space-y-4 pb-8">
            <div className="mb-4 space-y-4">
              {generateAndSign.isPending && (
                <p className="text-sm">Generating documents. Please wait...</p>
              )}

              <Progress
                value={fakeProgress}
                indicatorColor={
                  generateAndSign.isError
                    ? "bg-red-600"
                    : generateAndSign.isSuccess
                      ? "bg-green-600"
                      : null
                }
                indicatorBgColor={
                  generateAndSign.isError
                    ? "bg-red-600/10"
                    : generateAndSign.isSuccess
                      ? "bg-green-600/10"
                      : null
                }
              />
            </div>

            {generateAndSign.isError && (
              <Alert variant="destructive">
                <AlertTriangleIcon />
                <AlertTitle>Error</AlertTitle>

                <AlertDescription>
                  {generateAndSign.error?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </DialogContent>
    </Dialog>
  );
}
