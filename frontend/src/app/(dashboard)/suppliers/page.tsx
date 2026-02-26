"use client";

import { useEffect, useState } from "react";
import { Truck, Plus, Mail, Phone, ExternalLink, Globe, User } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await api.get("/supplier");
                setSuppliers(res.data.data);
            } catch (err) {
                console.error("Failed to fetch suppliers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Loading suppliers...</div>;

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black font-serif tracking-tight">Suppliers Registry</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Manage your supply chain and procurement contacts.
                    </p>
                </div>
                <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Add Supplier
                </Button>
            </div>

            <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b-2 px-8 py-6">
                    <CardTitle className="text-xl font-bold font-serif flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Vendor Partnerships
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10 border-b-2">
                                <TableHead className="py-5 px-8 font-bold text-foreground">Supplier Name</TableHead>
                                <TableHead className="py-5 font-bold text-foreground">Contact Detail</TableHead>
                                <TableHead className="py-5 font-bold text-foreground">Lead Time</TableHead>
                                <TableHead className="py-5 font-bold text-foreground">Status</TableHead>
                                <TableHead className="py-5 pr-8 font-bold text-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.length > 0 ? suppliers.map((s) => (
                                <TableRow key={s.id} className="group border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                                    <TableCell className="py-6 px-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
                                            {s.name?.slice(0, 1) || "S"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">{s.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.id.toString().slice(0, 8)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {s.email || "no-email@vendor.com"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3.5 h-3.5" /> {s.phone || "+00-1122-3344"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 font-bold text-sm">
                                        Approx. 4-7 days
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">VERIFIED</Badge>
                                    </TableCell>
                                    <TableCell className="py-6 pr-8 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-xl">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <Globe className="w-12 h-12" />
                                            <p className="font-bold text-lg">No suppliers found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
