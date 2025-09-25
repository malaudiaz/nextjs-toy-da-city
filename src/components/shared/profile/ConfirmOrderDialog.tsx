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

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export function ConfirmOrderDialog({ orderId, btnText, msgsuccess, msgerror }: Props) {

  const handleConfirm = async () => {
    try {
      const result = await confirmOrder(orderId);

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
          <Button variant="success">{btnText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogDescription>
                Are you sure you want to confirm this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleConfirm}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
