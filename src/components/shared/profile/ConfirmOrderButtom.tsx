// components/CancelOrderButton.tsx
'use client';



import { Button } from '@/components/ui/button';
import { confirmOrder } from '@/lib/actions/orderActions';
import { toast } from 'sonner'; // opcional: para notificaciones

type Props = {
  orderId: string;
};

export function ConfirmOrderButton({ orderId }: Props) {
  const handleConfirm = async () => {
    try {
      const result = await confirmOrder(orderId);

      if (result.success) {
        toast.success('Order confirmed successfully');
      } else {
        toast.error(result.error || 'Failed to confirm order');
      }

    } catch (error) {
      toast.error('Failed to confirm order');
      console.error(error);
    }
  };

  return (
    <Button onClick={handleConfirm} variant="default">
      Confirm
    </Button>
  );
}