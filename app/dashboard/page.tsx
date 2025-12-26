'use client';

import React from "react";
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

export default function DashboardPage() {
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
                <TableHead className="font-semibold text-slate-700">Order ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Amount</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-mono text-sm font-bold text-blue-600">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{row.customer}</div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      getStatusStyles(row.status)
                    )}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm italic">{row.date}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {row.amount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </Button>
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