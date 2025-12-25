'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanLine, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddInvoice({ deliveryId, onAdded }: { deliveryId: string; onAdded: () => void }) {
  const [invoice, setInvoice] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  async function submitInvoice(inv: string) {
    if (!inv.trim()) return toast.error('Enter an invoice number');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/delivery/${deliveryId}/add/${inv}`, { 
        method: 'GET', credentials: 'include' 
      });
      if (!res.ok) throw new Error('Failed to add');
      toast.success('Added');
      setInvoice('');
      onAdded();
    } catch (err) {
      toast.error('Error adding invoice');
    }
  }

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5Qrcode('scanner-area');
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 200 }, 
      (text) => { submitInvoice(text); setScanning(false); }, 
      () => {}
    ).then(() => { scannerRef.current = scanner; });

    return () => { scanner.stop().catch(() => {}); };
  }, [scanning]);

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Plus className="w-4 h-4 text-blue-600" /> Add New Invoice
      </h3>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Invoice #" 
          value={invoice} 
          onChange={(e) => setInvoice(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitInvoice(invoice)}
        />
        <Button variant="outline" onClick={() => setScanning(true)}>
          <ScanLine className="w-4 h-4" />
        </Button>
      </div>

      <Button className="w-full mt-2" onClick={() => submitInvoice(invoice)}>
        Add Invoice
      </Button>

      {scanning && (
        <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="font-bold">Scan Barcode</span>
            <Button variant="ghost" onClick={() => setScanning(false)}><X /></Button>
          </div>
          <div id="scanner-area" className="w-full max-w-sm aspect-square bg-slate-100 rounded-lg overflow-hidden" />
          <p className="mt-4 text-sm text-slate-500">Align barcode within the square</p>
        </div>
      )}
    </div>
  );
}