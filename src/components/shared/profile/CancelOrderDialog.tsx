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

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export function CancelOrderDialog({ orderId, btnText, msgsuccess, msgerror }: Props) {

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
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleCancel}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
