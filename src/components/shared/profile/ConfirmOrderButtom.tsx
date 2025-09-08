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
      toast.success('Order canceled successfully');
      console.log(result);
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error(error);
    }
  };

  return (
    <Button onClick={handleConfirm} variant="default">
      Cancel Order
    </Button>
  );
}