"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ArrowLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Comptes gérants", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-slate-900 min-h-screen flex flex-col">
            <div className="flex h-20 items-center px-8 shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-extrabold shadow-lg">
                        Eq
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-white">
                            Equigestion
                        </span>
                        <span className="block text-xs font-bold text-slate-400">Administration</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 text-base font-bold rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-4 px-4 py-3 text-base font-bold rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
                >
                    <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Retour à l'app
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-4 px-4 py-3 text-base font-semibold rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
