"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelOrder } from "@/lib/actions/orderActions";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import { useState } from 'react'; // ✅ Importa useState

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export function CancelOrderDialog({ orderId, btnText, msgsuccess, msgerror }: Props) {
  const t = useTranslations('cancelOrderDialog');
  const [open, setOpen] = useState(false); // ✅ Estado para controlar el modal
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCancel = async () => {
    setIsProcessing(true)
    try {
      const result = await cancelOrder(orderId);

      if (result.success) {
        toast.success(msgsuccess);
        setOpen(false); // ✅ Cierra el modal después de cancelar
      } else {
        toast.error(result.error || msgerror);
      }

    } catch (error) {
      toast.error(msgerror);
      console.error(error);
    } finally {
      setIsProcessing(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* ✅ Controla el estado del modal */}
      <DialogTrigger asChild>
        <Button variant="destructive">{btnText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("btnCancel")}</Button>
          </DialogClose>
          <Button 
            type="button" // ✅ Importantísimo: type="button" para evitar submit
            variant={"destructive"} 
            onClick={handleCancel}
            disabled={isProcessing}            
          >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  {t("processing")}
                </>
              ) : (
                t("btnConfirm")
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}