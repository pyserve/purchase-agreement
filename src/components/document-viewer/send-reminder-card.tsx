import { Button } from "@/components/ui/button";
import { sleep } from "@/lib/utils";
import { useZoho } from "@/providers/zoho-provider";
import { sendReminder } from "@/repo/purchase-agreement/sendReminder";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlarmClockIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SendReminderCard() {
  const { dataProvider } = useZoho();
  const { requestId } = useDocumentsStore();
  const [showConfirmSendReminder, setShowConfirmSendReminder] = useState(false);

  const remindMutation = useMutation({
    mutationFn: async () => {
      await sleep(1500);
      return sendReminder({ dataProvider, requestId });
    },
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error?.message || "Failed to send reminder");
    },
  });

  return (
    <div className="mx-auto w-full rounded-md border bg-white p-4">
      <div className="space-y-2">
        <p className="font-semibold text-gray-900">Send Reminder</p>
        <p className="mb-4 text-sm text-gray-600">
          Is the customer taking too long to respond? Send a quick reminder to
          keep things moving.
        </p>

        <AnimatePresence>
          {remindMutation.isSuccess ? (
            <motion.div
              initial={{ opacity: 0, x: 2 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-row items-center justify-center gap-x-2 rounded-md border p-1 text-sm font-medium"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-800">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              Reminder Sent
            </motion.div>
          ) : (
            <>
              {!showConfirmSendReminder && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowConfirmSendReminder(true)}
                  >
                    <AlarmClockIcon />
                    Send Reminder
                  </Button>
                </motion.div>
              )}

              {showConfirmSendReminder && (
                <div className="grid grid-cols-2 gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: 2 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={remindMutation.isPending}
                      onClick={() => setShowConfirmSendReminder(false)}
                    >
                      Cancel
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      className="w-full"
                      disabled={remindMutation.isPending}
                      onClick={() => remindMutation.mutate()}
                    >
                      {remindMutation.isPending && (
                        <Loader2Icon className="animate-spin" />
                      )}
                      Confirm
                    </Button>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
