// components/CancelOrderButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { cancelOrder } from '@/lib/actions/orderActions';
import { toast } from 'sonner'; // opcional: para notificaciones

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export async function CancelOrderButton({ orderId, btnText, msgsuccess, msgerror }: Props) {
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
    <Button onClick={handleCancel} variant="destructive">
      {btnText}
    </Button>
  );
}