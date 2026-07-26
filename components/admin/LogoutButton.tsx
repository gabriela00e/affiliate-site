"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-onyx/60 hover:bg-champagne/50 dark:text-pearl/60 dark:hover:bg-onyx"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
