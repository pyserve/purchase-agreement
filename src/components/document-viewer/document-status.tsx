import { cn } from "@/lib/utils";
import type { DocumentAction, DocumentStatus } from "@/types/sign";
import { CheckCircle, Eye, Mail, PenTool } from "lucide-react";

interface DocumentStatusTrackerProps {
  action: DocumentAction;
  className?: string;
}

export default function DocumentStatusTracker({
  action,
  className = "",
}: DocumentStatusTrackerProps) {
  const statusOrder = action.is_embedded
    ? ["VIEWED", "SIGNED"]
    : ["UNOPENED", "VIEWED", "SIGNED"];

  const statusSteps = action.is_embedded
    ? [
        {
          key: "VIEWED" as DocumentStatus,
          label: "Viewed",
          icon: Eye,
        },
        {
          key: "SIGNED" as DocumentStatus,
          label: "Signed",
          icon: PenTool,
        },
      ]
    : [
        {
          key: "UNOPENED" as DocumentStatus,
          label: "Mailed",
          icon: Mail,
        },
        {
          key: "VIEWED" as DocumentStatus,
          label: "Viewed",
          icon: Eye,
        },
        {
          key: "SIGNED" as DocumentStatus,
          label: "Signed",
          icon: PenTool,
        },
      ];

  const getStepStatus = (stepKey: DocumentStatus) => {
    const currentIndex = action.action_status
      ? statusOrder.indexOf(action.action_status)
      : -1;
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex <= currentIndex) {
      return "completed";
    }
    return "pending";
  };

  const isLastStep = (index: number) => index === statusSteps.length - 1;

  return (
    <div className={`rounded-md border p-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 flex flex-col items-start md:mb-0">
          <p className="text-base">{action.recipient_name}</p>
          <p className="text-sm text-gray-500">
            {[
              action.recipient_email,
              `${action.recipient_countrycode}${action.recipient_phonenumber}`,
            ]
              .filter((v) => !!v)
              .join(", ")}
          </p>

          <p className="mt-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {action.is_embedded
              ? "Embedded Sign"
              : action.delivery_mode == "EMAIL"
                ? "Sent to Email"
                : "Sent to Email and Phone"}
          </p>
        </div>

        {/* Status Steps */}
        <div className="flex items-center">
          {statusSteps.map((step, index) => {
            const stepStatus = getStepStatus(step.key);
            const isCompleted = stepStatus === "completed";
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "border-green-600 bg-green-600"
                        : "border-gray-200 bg-gray-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-4 w-4 text-gray-500" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${
                        isCompleted ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLastStep(index) && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 min-w-[60px] flex-1 -translate-y-2.5 rounded-full",
                      getStepStatus(statusSteps[index + 1].key) === "completed"
                        ? "bg-green-600"
                        : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
