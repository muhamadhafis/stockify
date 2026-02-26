"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await api.get("/part");
        setParts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch parts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Parts Catalog</h1>
          <p className="text-muted-foreground font-medium">Manage your spare parts and inventory items</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6">
          <Plus className="w-5 h-5" /> Add New Part
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search parts by name or keyword..." className="pl-10 h-11 bg-muted/20 border-none rounded-xl" />
        </div>
        <Button variant="outline" className="h-11 rounded-xl">Filters</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Total Stock</TableHead>
              <TableHead className="text-right">Min. Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground animate-pulse">
                  Loading parts...
                </TableCell>
              </TableRow>
            ) : parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No parts found. Start by adding a new part.
                </TableCell>
              </TableRow>
            ) : (
              parts.map((part: any) => (
                <TableRow key={part.id} className="group cursor-pointer hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden border border-border group-hover:scale-150 group-hover:z-10 transition-transform origin-left">
                      {part.image ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}${part.image}`} alt={part.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                          {part.name.slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{part.name}</TableCell>
                  <TableCell className="text-muted-foreground font-medium uppercase text-xs">{part.unit || "unit"}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-base">{part.total_quantity || 0}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{part.minimum_stock || 0}</TableCell>
                  <TableCell>
                    {(part.total_quantity || 0) <= (part.minimum_stock || 0) ? (
                      <Badge variant="destructive" className="rounded-full px-3">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 rounded-full px-3">Healthy</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/parts/${part.id}`}>
                      <Button variant="ghost" size="icon" className="group-hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
