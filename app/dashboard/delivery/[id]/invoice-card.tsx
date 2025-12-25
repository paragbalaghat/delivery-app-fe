'use client';

import { Button } from '@/components/ui/button';
import { Trash2, FileText, User, Tag } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a standard shadcn/ui utility

type Invoice = {
  invType: string;
  invNo: string;
  customerName: string;
  status: string;
};

export default function InvoiceCard({
  invoice,
  onDelete,
}: {
  invoice: Invoice;
  onDelete: (invType: string, invNo: string) => void;
}) {
  // Helper to color-code status badges
  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliv')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s.includes('pend')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (s.includes('can')) return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  return (
    <div className="group relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
      <div className="flex flex-col gap-4">
        {/* Header: Icon + Invoice ID */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              <FileText className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {invoice.invType}
              </p>
              <p className="text-base font-bold text-slate-900 leading-none">
                #{invoice.invNo}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(invoice.invType, invoice.invNo)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Content: Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="h-3.5 w-3.5" />
            <p className="text-sm font-medium truncate">
              {invoice.customerName}
            </p>
          </div>
        </div>

        {/* Footer: Status Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tight",
            getStatusStyles(invoice.status)
          )}>
            <Tag className="h-3 w-3" />
            {invoice.status}
          </div>
          
          <span className="text-[10px] text-slate-400 font-medium italic">
            ID Secured
          </span>
        </div>
      </div>
    </div>
  );
}