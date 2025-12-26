'use client';

import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Search, Plus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Delivery = {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  invoiceCount: number;
}

export default function DashboardPage() {

  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);

  useEffect(() => {

    const fetchDeliveries = async () => {
      try {
        const res = await fetch(`/api/delivery`, {
          method: 'GET',
          credentials: 'include',
        })
        
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || 'Failed to fetch deliveries');
        }

        setDeliveries(json.data);

      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      }
    }

    fetchDeliveries();

  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Header Section */}
      <header className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deliveries</h1>
            <p className="text-slate-500 text-sm">Manage and track your pharmaceutical shipments</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={'/dashboard/status'}>
            <Button variant="outline" className="gap-2 bg-white">
              <ArrowDownUp className="h-4 w-4" />
              Order Status
            </Button>
            </Link>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200">
              <Plus className="h-4 w-4" />
              Create Delivery
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-6">
        {/* 2. Filters & Stats Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Order ID or Customer..." 
              className="pl-10 bg-white border-slate-200 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Showing {data.length} active orders</span>
          </div>
        </div>

        {/* 3. Refined Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Delivery ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Started</TableHead>
                <TableHead className="font-semibold text-slate-700">Ended</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Invoice Count</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-slate-900">{delivery.id}</TableCell>
                  <TableCell>{delivery.startedAt ? new Date(delivery.startedAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{delivery.endedAt ? new Date(delivery.endedAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-center">{delivery.invoiceCount}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/delivery/${delivery.id}`}>
                      <Button variant="ghost" className="p-0 w-8 h-8">
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

// Helper for row styles
const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s === "delivered") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (s === "dispatched") return "bg-blue-50 text-blue-700 border-blue-100";
  if (s === "processing") return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-slate-50 text-slate-700 border-slate-100";
};

const data = [
  { id: "ORD-21085", customer: "Rajesh Pharma", status: "Dispatched", date: "25 Dec 2025", amount: "₹12,430" },
  { id: "ORD-21086", customer: "Apollo Medicals", status: "Processing", date: "25 Dec 2025", amount: "₹8,210" },
  { id: "ORD-21087", customer: "City Care", status: "Delivered", date: "24 Dec 2025", amount: "₹15,900" },
];