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
import { useTranslations } from 'next-intl'; // ✅ Importa el hook

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export function CancelOrderDialog({ orderId, btnText, msgsuccess, msgerror }: Props) {
  const t = useTranslations('cancelOrderDialog'); // ✅ Usa el hook

  const handleCancel = async () => {
    try {
      const result = await cancelOrder(orderId);

      if (result.success) {
        toast.success(msgsuccess);
      } else {
        toast.error(result.error || msgerror);
      }

    } catch (error) {
      toast.error(msgerror);
      console.error(error);
    }
  };

  return (
    <Dialog>
      <form>
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
              <Button variant="destructive">{t("btnCancel")}</Button>
            </DialogClose>
            <Button type="submit" variant={"success"} onClick={handleCancel}>{t("btnConfirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
