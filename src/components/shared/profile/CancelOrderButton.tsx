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
      toast.success('Order canceled successfully');
      console.log(result);
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