import { Users, Building2, PawPrint, UserCheck } from "lucide-react";
import Link from "next/link";
import { getAdminStats } from "@/lib/admin-actions";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminPage() {
    const stats = await getAdminStats();

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 p-8 lg:p-12">
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            Administration
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium">
                            Gérez les comptes des gérants de pension
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Users className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">{stats.totalManagers}</p>
                                    <p className="text-sm font-bold text-slate-500">Gérants</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <UserCheck className="h-7 w-7 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">{stats.activeManagers}</p>
                                    <p className="text-sm font-bold text-slate-500">Actifs</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                                    <PawPrint className="h-7 w-7 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">{stats.totalHorses}</p>
                                    <p className="text-sm font-bold text-slate-500">Chevaux</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <Building2 className="h-7 w-7 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">{stats.totalOwners}</p>
                                    <p className="text-sm font-bold text-slate-500">Propriétaires</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Actions rapides</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border-2 border-transparent transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">Gérer les comptes</p>
                                    <p className="text-sm text-slate-500 font-medium">Créer, modifier, activer/désactiver</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
