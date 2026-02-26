"use client";

import { useEffect, useState } from "react";
import { Package, MapPin, History, Filter, Search, MoreHorizontal, ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function StockManagementPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockRes, locRes] = await Promise.all([
          api.get("/stock"),
          api.get("/location")
        ]);
        setStocks(stockRes.data.data);
        setLocations(locRes.data.data);
      } catch (err) {
        console.error("Failed to fetch stock data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStocks = stocks.filter(s => {
      const matchSearch = s.part_name?.toLowerCase().includes(search.toLowerCase()) || 
                          s.batch_number?.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === "all" || s.location_name === locationFilter;
      return matchSearch && matchLocation;
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-sans animate-pulse">Loading stocks...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-serif tracking-tight">Stock Inventory</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Package className="w-4 h-4" /> Manage physical stock, locations, and batch tracking.
          </p>
        </div>
        <div className="flex gap-2">
           <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                Update Stock
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search parts or batches..." 
            className="pl-11 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/40 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-12 rounded-2xl px-5 font-bold flex gap-2 border-border border-2 bg-background hover:bg-muted/50">
                        <Filter className="w-4 h-4" /> {locationFilter === "all" ? "All Locations" : locationFilter}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1 rounded-2xl border-2">
                    <DropdownMenuItem onClick={() => setLocationFilter("all")} className="rounded-xl font-bold cursor-pointer">All Locations</DropdownMenuItem>
                    {locations.map(loc => (
                         <DropdownMenuItem key={loc.id} onClick={() => setLocationFilter(loc.name)} className="rounded-xl font-bold cursor-pointer">{loc.name}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2.5rem] border-2 bg-primary text-primary-foreground overflow-hidden shadow-xl shadow-primary/20 relative">
              <Package className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
              <CardContent className="pt-8">
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1 font-sans">Total Stock Units</p>
                  <p className="text-5xl font-black font-serif">{stocks.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full whitespace-nowrap">
                      <ArrowUp className="w-3 h-3" /> +12.5% this month
                  </div>
              </CardContent>
          </Card>
          
          <Card className="rounded-[2.5rem] border-2 bg-muted/40 overflow-hidden relative">
              <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5" />
              <CardContent className="pt-8 text-foreground">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 font-sans">Active Locations</p>
                  <p className="text-5xl font-black font-serif">{locations.length}</p>
                   <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground bg-foreground/5 w-fit px-3 py-1.5 rounded-full whitespace-nowrap">
                      <ArrowRight className="w-3 h-3" /> Monitor all zones
                  </div>
              </CardContent>
          </Card>

           <Card className="rounded-[2.5rem] border-2 bg-destructive/10 overflow-hidden relative border-destructive/20">
              <History className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 text-destructive" />
              <CardContent className="pt-8">
                  <p className="text-sm font-bold text-destructive uppercase tracking-widest mb-1 font-sans">Low Stock Alerts</p>
                  <p className="text-5xl font-black font-serif text-destructive">
                      {stocks.filter(s => s.quantity < 10).length}
                  </p>
                   <div className="mt-4 flex items-center gap-2 text-xs font-bold text-destructive bg-destructive/10 w-fit px-3 py-1.5 rounded-full whitespace-nowrap">
                      <ArrowDown className="w-3 h-3" /> Requires attention
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card className="rounded-[2rem] border-2 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 border-b-2 px-8 py-6">
            <CardTitle className="text-xl font-bold font-serif">Inventory Registry</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 bg-muted/10">
                <TableHead className="py-5 px-8 font-bold text-foreground">Part Item</TableHead>
                <TableHead className="py-5 font-bold text-foreground">Location</TableHead>
                <TableHead className="py-5 font-bold text-foreground">Batch Number</TableHead>
                <TableHead className="py-5 font-bold text-foreground text-right">Qty</TableHead>
                <TableHead className="py-5 pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.length > 0 ? filteredStocks.map((s) => (
                <TableRow key={s.id} className="group border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                  <TableCell className="py-6 px-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-primary border text-sm shrink-0">
                         {s.part_name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-base group-hover:text-primary transition-colors">{s.part_name}</p>
                        <p className="text-xs text-muted-foreground font-medium">Internal ID: #{s.part_id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground italic">{s.location_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant="outline" className="rounded-lg font-mono text-xs bg-muted/50 border-border border-2">
                        {s.batch_number || "BATCH-" + s.id.toString().padStart(4, '0')}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-right">
                    <div className="space-y-1">
                        <p className={`text-xl font-black ${s.quantity < 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                            {s.quantity}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">Units</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 pr-8 text-right">
                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                   <TableCell colSpan={5} className="h-64 text-center">
                     <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Package className="w-12 h-12 opacity-20" />
                        <p className="font-bold text-lg">No stock results found.</p>
                        <p className="text-sm">Try adjusting your filters or searching for another part.</p>
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
