"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Package, MapPin, Truck, History } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PartDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartDetail = async () => {
      try {
        const res = await api.get(`/part/${id}`);
        setPart(res.data.data);
      } catch (err) {
        console.error("Failed to fetch part detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartDetail();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Loading part data...</div>;
  if (!part) return <div className="h-screen flex items-center justify-center font-sans">Part not found</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold font-serif">{part.name}</h1>
             <Badge variant="outline" className="border-primary/50 text-primary font-bold">{part.unit || "unit"}</Badge>
          </div>
          <p className="text-muted-foreground font-medium">Part ID: {id} • Catalog #{part.keyword || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 rounded-3xl border-border shadow-sm overflow-hidden">
             <div className="aspect-square bg-muted relative group">
                {part.image ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${part.image}`} alt={part.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground uppercase opacity-20">
                        {part.name.slice(0, 2)}
                    </div>
                )}
             </div>
             <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</p>
                    <p className="text-sm font-medium leading-relaxed">{part.description || "No description provided for this part catalog item."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> Created At
                        </div>
                        <p className="text-xs font-semibold">{part.created_at || "Just now"}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <User className="w-3 h-3" /> Created By
                        </div>
                        <p className="text-xs font-semibold">{part.created_by_name || "System"}</p>
                    </div>
                </div>
             </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="stocks" className="w-full">
                <TabsList className="bg-muted/50 p-1 h-12 rounded-xl border border-border">
                    <TabsTrigger value="stocks" className="rounded-lg font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Stock Items</TabsTrigger>
                    <TabsTrigger value="suppliers" className="rounded-lg font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Suppliers</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Tracking</TabsTrigger>
                </TabsList>

                <TabsContent value="stocks" className="mt-6">
                    <Card className="rounded-2xl shadow-sm border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold font-serif flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" /> Stock Inventory
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead>Location</TableHead>
                                        <TableHead>Batch #</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {part.stocks?.length > 0 ? part.stocks.map((item: any) => (
                                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold font-sans flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" /> {item.location_name}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{item.batch_number || "GENERIC"}</TableCell>
                                            <TableCell className="text-right font-bold text-base">{item.quantity}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200">OK</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">No physical stock available currently.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suppliers" className="mt-6">
                    <Card className="rounded-2xl shadow-sm border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold font-serif flex items-center gap-2">
                                <Truck className="w-5 h-5 text-primary" /> Approved Suppliers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead>Supplier Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Last Lead Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {part.suppliers?.length > 0 ? part.suppliers.map((s: any) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-bold">{s.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm font-medium">{s.email || s.phone || "No contact info"}</TableCell>
                                            <TableCell className="text-muted-foreground">Approx 4 days</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">No registered suppliers for this item.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="history" className="mt-6">
                    <Card className="rounded-2xl shadow-sm border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold font-serif flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" /> Movement History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                {(part.tracking || []).map((t: any) => (
                                    <div key={t.id} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/10">
                                        <div className={`w-2 rounded-full ${t.delta > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-bold text-sm">{t.notes || "Stock Adjustment"}</p>
                                                <span className={`font-mono font-bold ${t.delta > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                                    {t.delta > 0 ? '+' : ''}{t.delta}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-3">
                                                <span>{t.date}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.user_name}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!part.tracking || part.tracking.length === 0) && (
                                     <div className="h-24 flex items-center justify-center text-muted-foreground italic text-sm">No tracking data found for this item.</div>
                                )}
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
