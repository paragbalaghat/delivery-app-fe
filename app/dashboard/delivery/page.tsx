'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function DeliveryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createDelivery() {
    setLoading(true);

    try {
      const res = await fetch(`/api/delivery/create`,{
          method: 'POST',
          credentials: 'include',
        });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create delivery');
      }

      const deliveryId = data.data.delivery.id;

      toast.success('Delivery created');
      router.push(`/dashboard/delivery/${deliveryId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-fit bg-slate-50/50 p-6 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Delivery</CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full"
            onClick={createDelivery}
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create Delivery'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
