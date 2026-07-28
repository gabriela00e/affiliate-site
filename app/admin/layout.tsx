import Link from "next/link";
import { LayoutDashboard, Package, PlusCircle } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

// The admin section is gated by middleware.ts (signed-cookie session check)
// and by requireAdmin() inside its API routes — both correct and functional
// today. This export is additional, deliberate insurance: it tells Next.js
// itself that nothing under /admin should ever be statically cached, so a
// future server-rendered per-admin value can't get silently baked into a
// shared static build and served to every visitor.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-champagne/20 dark:bg-onyx">
      <aside className="hidden w-60 flex-col border-r border-onyx/10 bg-white p-6 dark:border-pearl/10 dark:bg-onyx2 md:flex">
        <Link href="/admin" className="mb-8 font-display text-xl">
          Admin<span className="text-gold">.</span>
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-champagne/50 dark:hover:bg-onyx">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-champagne/50 dark:hover:bg-onyx">
            <Package className="h-4 w-4" /> Products
          </Link>
          <Link href="/admin/products/new" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-champagne/50 dark:hover:bg-onyx">
            <PlusCircle className="h-4 w-4" /> Add product
          </Link>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
