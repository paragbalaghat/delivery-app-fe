'use client';

import React, { useEffect, useState } from 'react';
import {
  Loader2,
  Package,
  Clock,
  History,
  CircleDollarSign,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';

interface Delivery {
  id: string;
  deliveryNo: string;
  failedDeliveries: string[];
  startedAt: string | null;
  endedAt: string | null;
  isPaid: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
};

export function UserDeliveriesCard({ userId }: { userId: string }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDeliveriesData() {
      try {
        const response = await fetch(`/api/users/${userId}/deliveries`);
        const json = await response.json();
        setDeliveries(json.data || []);
      } catch (error) {
        console.error("Error fetching user deliveries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveriesData();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-[24px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Logistics...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-[24px] overflow-hidden flex flex-col shadow-sm h-full">
      {/* Header Section */}
      <div className="bg-blue-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Trip Logistics</h3>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Historical Performance</p>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full border border-white/20">
          <span className="text-[10px] font-black text-white">{deliveries.length} Total</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto h-full">
        {deliveries.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-gray-50"
          >
            {deliveries.map((delivery) => {
              const isFailed = delivery.failedDeliveries.length > 0;
              const isActive = !delivery.endedAt;
              const isCompleted = delivery.endedAt && !isFailed;

              return (
                <Link href={`/dashboard/supervisor/deliveries/${delivery.id}`} key={delivery.id}>
                  <motion.div
                    variants={itemVariants}
                    className="p-5 hover:bg-gray-50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900 tracking-tighter bg-gray-100 px-2 py-0.5 rounded">
                            #{delivery.deliveryNo}
                          </span>
                          {delivery.isPaid && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded text-[9px] font-black text-green-600 border border-green-100 uppercase">
                              <CircleDollarSign className="h-3 w-3" /> Paid
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <p className="text-[10px] font-bold uppercase">
                            {delivery.startedAt ? new Date(delivery.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Start'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isActive && (
                          <div className="flex items-center gap-1 text-blue-600 animate-pulse">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">In Progress</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">Completed</span>
                          </div>
                        )}
                        {isFailed && (
                          <div className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{delivery.failedDeliveries.length} Exceptions</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden mr-6">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: isCompleted || isFailed ? '100%' : '60%' }}
                        />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <div className="p-6 bg-gray-50 rounded-full mb-4 border border-dashed border-gray-200">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <h4 className="text-gray-900 font-bold text-sm">No History Found</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ready for assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDeliveriesCard;