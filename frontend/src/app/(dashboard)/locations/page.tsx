"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, MoreVertical, Edit, Trash2, Box, Package } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LocationsPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get("/location");
                setLocations(res.data.data);
            } catch (err) {
                console.error("Failed to fetch locations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Loading zones...</div>;

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black font-serif tracking-tight">Storage Zones</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Define physical warehouses, shelves, or compartments.
                    </p>
                </div>
                <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Add Location
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.length > 0 ? locations.map((loc) => (
                    <Card key={loc.id} className="group rounded-[2rem] border-2 border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="p-3 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                                <Box className="w-6 h-6 text-primary" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-2">
                                    <DropdownMenuItem className="font-bold cursor-pointer"><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="font-bold text-destructive cursor-pointer hover:bg-destructive/10"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold font-serif">{loc.name}</h3>
                                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1">UUID: {loc.id.toString().slice(0, 8)}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 pt-4 border-t border-border">
                                <div className="flex-1 space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Status</p>
                                    <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200 text-[10px] font-black">ACTIVE</Badge>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Total Items</p>
                                    <p className="text-lg font-black">{loc.item_count || 0}</p>
                                </div>
                            </div>

                            <Button variant="ghost" className="w-full rounded-xl bg-muted/30 font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                                View Stock Map
                            </Button>
                        </CardContent>
                    </Card>
                )) : (
                     <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] bg-muted/10">
                        <MapPin className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                        <p className="font-bold text-lg">No storage locations configured.</p>
                        <p className="text-sm text-muted-foreground">Start by defining your first warehouse or shelf.</p>
                     </div>
                )}
            </div>
        </div>
    );
}
