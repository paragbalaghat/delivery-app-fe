'use client';

import { User, FileText, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Invoice = {
  invType: string;
  invNo: string;
  customerName: string;
  status: string;
};

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const isDelivered = invoice.status === 'DELIVERED';
  const isFailed = invoice.status === 'FAILED';
  const isPending = invoice.status === 'OUT_FOR_DELIVERY';

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
      <Link href={`/dashboard/supervisor/invoice/${invoice.invType}${invoice.invNo}`}>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-500 transition-colors group shadow-sm">
          
          {/* Header: ID and Status */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-gray-900 text-sm">
                {invoice.invType}/{invoice.invNo}
              </span>
            </div>
            
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              isDelivered ? 'bg-green-50 text-green-700 border-green-100' : 
              isFailed ? 'bg-red-50 text-red-700 border-red-100' : 
              'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
              {isDelivered && <CheckCircle2 className="h-3 w-3" />}
              {isPending && <Clock className="h-3 w-3 animate-pulse" />}
              {isFailed && <AlertCircle className="h-3 w-3" />}
              {invoice.status.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Body: Customer */}
          <div className="mb-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Customer</p>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-300" />
              <p className="text-sm font-bold text-gray-700 truncate">{invoice.customerName}</p>
            </div>
          </div>

          {/* Footer: Simple Link */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <span className="text-[10px] font-black text-blue-600 uppercase">View Details</span>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}