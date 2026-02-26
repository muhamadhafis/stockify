import Link from "next/link";
import { MoveRight, Zap, Target, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-serif">S</span>
            </div>
            <span className="text-xl font-bold font-serif bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Stockify
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="grow pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border animate-bounce">
              <span className="text-xs font-semibold text-accent-foreground tracking-wide uppercase">New: API Integration</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-[1.1]">
              Inventory management <br />
              <span className="bg-linear-to-r from-primary via-blue-700 to-primary bg-size-[200%_auto] bg-clip-text text-transparent italic">reimagined.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track parts, manage stock levels, and coordinate suppliers in one minimalist interface. Designed for high-performance teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 h-14 group shadow-xl shadow-primary/30">
                  Join Stockify <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-14 bg-background border-border">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
            <div className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Rapid Parts Management</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Organize complex part catalogs with visual previews and detailed metadata indexing.</p>
            </div>

            <div className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Precise Stock Location</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Map your physical inventory across multiple locations, batches, and sub-locations.</p>
            </div>

            <div className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Analytics & Tracking</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Full audit trails for every item movement, adjustment, and supplier interaction.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-12 bg-muted">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <span className="text-background text-xs font-bold font-serif">S</span>
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider font-serif">Stockify</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">© 2026 Stockify Platforms Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
