// components/CancelOrderButton.tsx
'use client';


import { Button } from '@/components/ui/button';
import { cancelOrder } from '@/lib/actions/orderActions';
import { toast } from 'sonner'; // opcional: para notificaciones

type Props = {
  orderId: string;
};

export function CancelOrderButton({ orderId }: Props) {
  const handleCancel = async () => {
    try {
      const result = await cancelOrder(orderId);

      if (result.success) {
        toast.success('Order canceled successfully');
      } else {
        toast.error(result.error || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error(error);
    }
  };

  return (
    <Button onClick={handleCancel} variant="destructive">
      Cancel Order
    </Button>
  );
}