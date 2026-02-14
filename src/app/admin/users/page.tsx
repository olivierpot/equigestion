import { Search, UserPlus, Users } from "lucide-react";
import { getUsers } from "@/lib/admin-actions";
import AdminSidebar from "@/components/AdminSidebar";
import AddUserButton from "@/components/AddUserButton";
import EditUserButton from "@/components/EditUserButton";
import DeleteUserButton from "@/components/DeleteUserButton";
import ToggleUserButton from "@/components/ToggleUserButton";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 p-8 lg:p-12">
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">
                                Comptes gérants
                            </h1>
                            <p className="text-muted-foreground mt-1 font-medium">
                                Gérez les accès des gérants de pension
                            </p>
                        </div>
                        <AddUserButton />
                    </div>

                    {/* Liste */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                        <div className="p-8 border-b bg-slate-50/50">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou email..."
                                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Gérant</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Données</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 text-lg">{user.name || "Sans nom"}</div>
                                                <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <ToggleUserButton id={user.id} isActive={user.isActive} />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-3">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                                                        {user._count.horses} chevaux
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                                                        {user._count.owners} propriétaires
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <div className="flex justify-end gap-3">
                                                    <EditUserButton user={user} />
                                                    <DeleteUserButton id={user.id} name={user.name || user.email} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                        <Users className="h-8 w-8 text-slate-300" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-lg">Aucun gérant</p>
                                                        <p className="text-slate-500 font-medium">Créez le premier compte gérant.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
