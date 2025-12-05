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
import { confirmOrder } from "@/lib/actions/orderActions";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import { useState } from 'react'; // ✅ Importa useState

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export function ConfirmOrderDialog({ orderId, btnText, msgsuccess, msgerror }: Props) {
  const t = useTranslations('confirmOrderDialog');
  const [open, setOpen] = useState(false); // ✅ Estado para controlar el modal

  const handleConfirm = async () => {
    try {
      const result = await confirmOrder(orderId);

      if (result.success) {
        toast.success(msgsuccess);
        setOpen(false); // ✅ Cierra el modal después de confirmar
      } else {
        toast.error(result.error || msgerror);
      }

    } catch {
      toast.error(msgerror);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* ✅ Controla el estado del modal */}
      <DialogTrigger asChild>
        <Button variant="success">{btnText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">{t("btnCancel")}</Button>
          </DialogClose>
          <Button 
            type="button" // ✅ Importantísimo: type="button" para evitar submit
            variant={"success"} 
            onClick={handleConfirm}
          >
            {t("btnConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}