"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
    Calendar, ArrowLeft, ExternalLink, Clock, IndianRupee,
    MapPin, CircleX, Loader2, Box, ShoppingBag, Snowflake,
    Archive, PackageX, Truck, Phone, Fingerprint
} from "lucide-react"
import Image from "next/image"
import { motion, Variants } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SingleLocationMap from "@/components/supervisor/single-location-map"

type InvoiceData = {
    id: string;
    invType: string;
    invNo: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    status: string;
    createdAt: string;
    deliveredAt: string | null;
    updatedAt: string;
    deliveryRemark: string | null;
    location: string | null;
    boxes: number;
    bags: number;
    icePacks: number;
    cases: number;
    delivery?: {
        deliveryNo: string;
        startedAt: string | null;
        endedAt: string | null;
        deliveryMan: {
            name: string;
            phone: string;
            esId: string;
            email: string;
        }
    };
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const InvoicePage = () => {
    const params = useParams();
    const { invoiceId } = params;
    const router = useRouter();

    const [data, setData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInvoice = async () => {
        try {
            const res = await fetch(`/api/orders/invoice/${invoiceId}`);
            const json = await res.json();
            if (json.success) setData(json.data);
        } catch (error) {
            console.error("Failed to fetch invoice", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (invoiceId) fetchInvoice();
    }, [invoiceId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Fetching details...</p>
                </motion.div>
            </div>
        );
    }

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <CircleX className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-xl font-bold">Invoice Not Found</h1>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-none">Invoice Details</h1>
                            <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">{data.invType} #{data.invNo}</p>
                        </div>
                    </div>
                </div>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto space-y-6 p-4 md:p-8"
            >
                {/* Branding & Status */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border rounded-2xl shadow-sm">
                            <Image alt='Logo' src='https://rajeshpharma.com/img/rp.svg' className='w-8 h-8' width={32} height={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 leading-tight">
                                {data.invType}/{data.invNo}
                            </h1>
                            <p className="text-xs font-bold text-green-600 uppercase tracking-tighter">Verified Record</p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        data.status === 'DELIVERED' ? "bg-emerald-50 border-emerald-200 text-emerald-600" : data.status=== 'FAILED' ? "bg-red-50 border-red-200 text-red-600" : "bg-amber-50 border-amber-200 text-amber-600"
                    )}>
                        {data.status.replace(/_/g, ' ')}
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Card */}
                    <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer</p>
                                <p className="font-bold text-slate-900 text-lg leading-tight">{data.customerName}</p>
                            </div>
                            {data.customerPhone && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contact</p>
                                    <p className="text-sm font-semibold text-slate-700">{data.customerPhone}</p>
                                </div>
                            )}
                            {data.customerAddress && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Address</p>
                                    <p className="text-sm font-semibold text-slate-700">{data.customerAddress}</p>
                                </div>
                            )}
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payable Amount</p>
                                    <div className="flex items-center text-2xl font-black text-slate-900">
                                        <IndianRupee className="w-5 h-5 text-emerald-600" />
                                        {data.amount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Meta Info */}
                    <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
                        {data.delivery && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Run Number</span>
                                <span className="text-sm font-bold text-slate-900">{data.delivery.deliveryNo}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Billed Date</span>
                            <span className="text-sm font-bold text-slate-900">{new Date(data.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        {data.location && (
                            <div className="pt-2">
                                <SingleLocationMap location={data?.location} />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* DELIVERY EXECUTIVE SECTION - NEW */}
                {data.delivery?.deliveryMan && (
                    <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Truck className="w-20 h-20 text-slate-900" />
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-black text-xl border border-green-100">
                                    {data.delivery.deliveryMan.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivery Executive</p>
                                    <h3 className="text-xl font-bold text-slate-900">{data.delivery.deliveryMan.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                                            <Fingerprint className="w-3 h-3" />
                                            ID: {data.delivery.deliveryMan.esId}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={`tel:${data.delivery.deliveryMan.phone}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-green-100"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Executive
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Packaging Section */}
                <motion.div variants={itemVariants}>
                    <PackagingSection packaging={data} />
                </motion.div>

                {/* Remarks */}
                {data.deliveryRemark && (
                    <motion.div variants={itemVariants} className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Delivery Note</p>
                        <p className="text-sm text-amber-900 font-medium italic">"{data.deliveryRemark}"</p>
                    </motion.div>
                )}

                {/* Timeline */}
                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tracking Timeline</p>
                    </div>
                    <div className="p-8">
                        <div className="relative space-y-0">
                            {data.status === 'FAILED' && (
                                <TimelineNode
                                        icon={<PackageX />}
                                        title="Failed Delivery"
                                        desc="Delivery could not be completed"
                                        time={data.updatedAt ? new Date(data.updatedAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', hour12: true }) : "Pending"}
                                        isDone={!!data.updatedAt}
                                    />
                            )}
                            {data.delivery && (
                                <>
                                    <TimelineNode
                                        icon={<Truck />}
                                        title="Out for Delivery"
                                        desc="Executive started the run"
                                        time={data.delivery.startedAt ? new Date(data.delivery.startedAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : "Pending"}
                                        isDone={!!data.delivery.startedAt}
                                    />
                                    <TimelineNode
                                        icon={<CheckCircleIcon />}
                                        title="Delivered Successfully"
                                        desc="Handed over to the customer"
                                        time={data.deliveredAt ? new Date(data.deliveredAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : "Waiting..."}
                                        isDone={!!data.deliveredAt}
                                        isLast
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

// Sub-components with internal icon helpers
const CheckCircleIcon = () => <div className="w-5 h-5 bg-white rounded-full border-2 border-current" />;

const DetailRow = ({ icon, label, value, isLocation }: any) => {
    const handleLocationClick = () => {
        if (!value) return;
        try {
            const coords = typeof value === 'string' ? JSON.parse(value) : value;
            if (coords.lat && coords.lng) {
                window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            {isLocation && value ? (
                <button onClick={handleLocationClick} className="text-green-600 font-bold flex items-center gap-1 hover:underline text-xs">
                    Map <ExternalLink className="w-3 h-3" />
                </button>
            ) : (
                <span className="font-bold text-slate-900">{value || "N/A"}</span>
            )}
        </div>
    );
};

const PackagingSection = ({ packaging }: { packaging: any }) => {
    const items = [
        { label: "Boxes", value: packaging.boxes, icon: <Box className="w-4 h-4" /> },
        { label: "Bags", value: packaging.bags, icon: <ShoppingBag className="w-4 h-4" /> },
        { label: "Ice Packs", value: packaging.icePacks, icon: <Snowflake className="w-4 h-4" /> },
        { label: "Cases", value: packaging.cases, icon: <Archive className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
                {items.map((item) => (
                    <div key={item.label} className={cn("py-6 flex flex-col items-center", item.value > 0 ? "bg-green-50/20" : "opacity-30")}>
                        <div className={cn("p-2 rounded-xl mb-2", item.value > 0 ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
                        <span className="text-xl font-black text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TimelineNode = ({ icon, title, desc, time, isDone, isLast }: any) => (
    <div className="flex gap-6">
        <div className="flex flex-col items-center">
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all",
                isDone ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-300"
            )}>
                {icon}
            </div>
            {!isLast && <div className={cn("w-0.5 h-16 my-1", isDone ? "bg-green-600" : "bg-slate-100")} />}
        </div>
        <div className="pt-1">
            <p className={cn("font-bold text-sm", isDone ? "text-slate-900" : "text-slate-400")}>{title}</p>
            <p className="text-xs text-slate-500 font-medium">{desc}</p>
            <p className="text-[10px] font-mono font-bold text-green-500 mt-2 uppercase tracking-widest">{time}</p>
        </div>
    </div>
);

export default InvoicePage;