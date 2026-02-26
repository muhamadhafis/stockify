"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  Users, 
  History, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, partsRes, historyRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/part"),
          api.get("/stocks/history")
        ]);
        setStats(statsRes.data.data);
        setLowStock(partsRes.data.data?.filter((p: any) => p.total_quantity < 10)?.slice(0, 5) || []);
        setRecentHistory(historyRes.data.data?.slice(0, 5) || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Initializing Dashboard...</div>;

  const cards = [
    { title: "Total Parts", value: stats?.total_parts || 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Vendors", value: stats?.total_suppliers || 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Stock Value", value: "$45.2k", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Low Stock Items", value: lowStock.length, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-10 font-sans pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-5xl font-black font-serif tracking-tighter">Overview</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Welcome back. Here's what's happening in your <span className="text-primary font-bold">Stockify</span> inventory today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 bg-background shadow-xs">
            <TrendingUp className="w-4 h-4 mr-2" /> Global Market
          </Button>
          <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:shadow-primary/30 active:scale-95 transition-all">
            <Zap className="w-4 h-4 mr-2" /> Quick Action
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Card key={idx} className="rounded-[2.5rem] border-2 shadow-sm group hover:border-primary/50 transition-all duration-300">
            <CardContent className="pt-8 px-8">
              <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <p className="text-xs font-black text-muted-foreground uppercase opacity-60 tracking-widest mb-1">{card.title}</p>
              <div className="flex items-baseline gap-2">
                 <h2 className="text-4xl font-black font-serif tracking-tight">{card.value}</h2>
                 <span className="text-xs font-bold text-emerald-600">+4.2%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <Card className="rounded-[3rem] border-2 shadow-sm overflow-hidden flex flex-col h-full">
            <CardHeader className="bg-muted/30 border-b-2 px-10 py-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black font-serif flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-rose-500" /> Critical Stock Levels
                    </CardTitle>
                    <CardDescription className="font-medium mt-1">Items that require immediate replenishment.</CardDescription>
                </div>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-muted/50">
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-rose-50/20 border-b-2">
                            <TableHead className="py-5 px-10 font-bold text-foreground">Part Name</TableHead>
                            <TableHead className="py-5 font-bold text-foreground">Catalog #</TableHead>
                            <TableHead className="py-5 font-bold text-foreground text-right">Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lowStock.length > 0 ? lowStock.map((p) => (
                            <TableRow key={p.id} className="border-b last:border-b-0 hover:bg-rose-50/10 transition-colors">
                                <TableCell className="py-6 px-10 font-bold text-base">{p.name}</TableCell>
                                <TableCell className="py-6 uppercase tracking-widest font-mono text-xs opacity-60">{p.keyword || "NONE"}</TableCell>
                                <TableCell className="py-6 pr-10 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <span className="text-xl font-black text-rose-600">{p.total_quantity}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{p.unit || 'pcs'}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-48 text-center text-muted-foreground italic font-medium">All stock levels within safe thresholds.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>

         <Card className="rounded-[3rem] border-2 shadow-sm overflow-hidden flex flex-col h-full">
            <CardHeader className="bg-muted/30 border-b-2 px-10 py-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black font-serif flex items-center gap-3">
                        <History className="w-6 h-6 text-blue-500" /> Recent Activity
                    </CardTitle>
                    <CardDescription className="font-medium mt-1">Live feed of global inventory movements.</CardDescription>
                </div>
                 <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-muted/50">
                    <ArrowUpRight className="w-5 h-5" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y-2 border-border">
                    {recentHistory.length > 0 ? recentHistory.map((h, i) => (
                        <div key={i} className="px-10 py-6 hover:bg-muted/20 transition-colors flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${h.delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {h.delta > 0 ? '+' : ''}{h.delta}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-base">{h.part_name}</p>
                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                    <span>{h.performed_by_name}</span> • <span>{h.notes || 'Adjusted'}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Just now</p>
                                <Badge variant="outline" className="text-[10px] uppercase font-black bg-muted/40">TRACEABLE</Badge>
                            </div>
                        </div>
                    )) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground italic font-medium">Monitoring data stream...</div>
                    )}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
