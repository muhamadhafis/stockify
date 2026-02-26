"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, User, Package, Calendar, ArrowRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/stocks/history");
        setHistory(res.data.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Loading history logs...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="space-y-1">
        <h1 className="text-4xl font-black font-serif tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground font-medium flex items-center gap-2">
            <HistoryIcon className="w-4 h-4" /> Comprehensive log of all stock movements and adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b-2 px-8 py-6">
                <CardTitle className="text-xl font-bold font-serif flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Activity Log
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/10 border-b-2">
                            <TableHead className="py-5 px-8 font-bold text-foreground">Date & Time</TableHead>
                            <TableHead className="py-5 font-bold text-foreground">Actor</TableHead>
                            <TableHead className="py-5 font-bold text-foreground">Action / Part</TableHead>
                            <TableHead className="py-5 font-bold text-foreground text-center">Qty Change</TableHead>
                            <TableHead className="py-5 pr-8 font-bold text-foreground text-right">Resulting Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? history.map((h) => {
                            const isPositive = h.delta > 0;
                            return (
                                <TableRow key={h.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{h.created_at?.split('T')[0] || "2023-11-01"}</span>
                                            <span className="text-xs text-muted-foreground">{h.created_at?.split('T')[1]?.slice(0, 5) || "12:00"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {h.performed_by_name?.slice(0, 2) || "AD"}
                                            </div>
                                            <span className="font-semibold text-sm">{h.performed_by_name || "Admin"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-sm flex items-center gap-2">
                                                <Package className="w-3 h-3 text-muted-foreground" /> {h.part_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground italic line-clamp-1">{h.notes || "Standard inventory adjustment"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                            {isPositive ? '+' : ''}{h.delta}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-xs text-muted-foreground font-medium line-through opacity-50">{h.before_quantity}</span>
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-black text-lg">{h.after_quantity}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <HistoryIcon className="w-12 h-12" />
                                        <p className="font-bold">No history available</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
