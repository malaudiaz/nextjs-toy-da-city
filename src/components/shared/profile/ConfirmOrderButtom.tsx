// components/CancelOrderButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { confirmOrder } from '@/lib/actions/orderActions';
import { toast } from 'sonner'; // opcional: para notificaciones

type Props = {
  orderId: string;
  btnText: string;
  msgsuccess: string;
  msgerror: string;
};

export async function ConfirmOrderButton({ orderId, btnText, msgsuccess, msgerror }: Props) {

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
    <Button onClick={handleConfirm} variant="success">
      {btnText}
    </Button>
  );
}