"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    CircleUser as HorseIcon,
    Users,
    Calendar,
    Stethoscope,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Pensionnaires", href: "/horses", icon: HorseIcon },
    { name: "Professionnels", href: "/providers", icon: Users },
    { name: "Rendez-vous", href: "/appointments", icon: Calendar },
    { name: "Médical", href: "/medical", icon: Stethoscope },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar when clicking a link on mobile
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    // Close sidebar when pressing ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Prevent scrolling when sidebar is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-[55] w-72 bg-white border-r shadow-2xl lg:shadow-none transition-transform duration-500 ease-spring lg:static lg:translate-x-0 lg:flex lg:flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-20 items-center px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-extrabold shadow-lg shadow-primary/20">
                            Eq
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            Equigestion
                        </span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 text-base font-bold rounded-2xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-slate-900"
                                )} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t bg-slate-50 space-y-2">
                    <Link
                        href="/settings"
                        onClick={handleLinkClick}
                        className="flex items-center gap-4 px-4 py-3 text-base font-bold rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all group"
                    >
                        <Settings className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                        Paramètres
                    </Link>
                    <button
                        className="flex w-full items-center gap-4 px-4 py-3 text-base font-semibold rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
