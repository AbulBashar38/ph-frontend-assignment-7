"use client";

import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDownloadReceipt } from "@/hooks";
import type { Payment } from "@/types";
import { getErrorMessage } from "@/utils";

// Downloads the PDF receipt of a paid bill
export default function ReceiptButton({
  payment,
  size = "xs",
}: {
  payment: Payment;
  size?: "xs" | "default";
}) {
  const download = useDownloadReceipt();

  return (
    <Button
      size={size}
      variant="outline"
      disabled={download.isPending}
      onClick={() =>
        download.mutate(
          {
            id: payment.id,
            filename:
              `receipt-${payment.rental.room.name}-month-${payment.periodNumber}.pdf`
                .toLowerCase()
                .replace(/\s+/g, "-"),
          },
          { onError: (error) => toast.error(getErrorMessage(error)) },
        )
      }
    >
      {download.isPending ? <Spinner /> : <FileDown />}
      Receipt
    </Button>
  );
}
