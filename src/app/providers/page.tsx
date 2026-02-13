import { Search, Phone, Mail, Calendar, Settings, Users } from "lucide-react";
import Link from "next/link";
import { getProviders, getSpecialties } from "@/lib/actions";
import AddProviderButton from "@/components/AddProviderButton";
import EditProviderButton from "@/components/EditProviderButton";
import DeleteProviderButton from "@/components/DeleteProviderButton";

export default async function ProvidersPage() {
    const providers = await getProviders();
    const specialties = await getSpecialties();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Professionnels
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Gérez votre réseau de professionnels de santé et prestataires.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/settings/specialties"
                        className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 rounded-2xl transition-all shadow-sm active:scale-90"
                        title="Gérer les spécialités"
                    >
                        <Settings className="h-6 w-6" />
                    </Link>
                    <AddProviderButton specialties={specialties} />
                </div>
            </div>

            {/* Search and List */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="p-8 border-b bg-slate-50/50 flex flex-col sm:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou spécialité..."
                            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:border-primary/20 hover:text-primary transition-all shadow-sm">
                            Toutes les spécialités
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Professionnel</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Expertise</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {providers.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-lg leading-tight">{item.name}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-slate-500 font-bold">
                                                {item.nextVisit
                                                    ? `Prochaine visite : ${new Date(item.nextVisit).toLocaleDateString('fr-FR')}`
                                                    : "Pas de visite prévue"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-primary/10 text-primary border border-primary/20">
                                            {item.specialty.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {item.phone && (
                                                <a
                                                    href={`tel:${item.phone}`}
                                                    className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                                                    title={item.phone}
                                                >
                                                    <Phone className="h-5 w-5" />
                                                </a>
                                            )}
                                            <button className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90">
                                                <Mail className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <div className="flex justify-end gap-3">
                                            <EditProviderButton provider={item} specialties={specialties} />
                                            <DeleteProviderButton id={item.id} name={item.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {providers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Users className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-lg">Aucun professionnel</p>
                                                <p className="text-slate-500 font-medium">Commencez par ajouter votre premier contact.</p>
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
    );
}
