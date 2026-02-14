import { Phone, Mail, UserCheck } from "lucide-react";
import { getOwnersWithHorseCount } from "@/lib/actions";
import AddOwnerButton from "@/components/AddOwnerButton";
import EditOwnerButton from "@/components/EditOwnerButton";
import DeleteOwnerButton from "@/components/DeleteOwnerButton";

export default async function ProprietairesPage() {
    const owners = await getOwnersWithHorseCount();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Propriétaires
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Gérez les propriétaires des chevaux en pension.</p>
                </div>
                <div className="flex items-center gap-3">
                    <AddOwnerButton />
                </div>
            </div>

            {/* List */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Propriétaire</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Chevaux</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {owners.map((owner) => (
                                <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-lg leading-tight">{owner.name}</div>
                                        <div className="text-xs text-slate-400 font-medium mt-1">
                                            Inscrit le {new Date(owner.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {owner.phone && (
                                                <a
                                                    href={`tel:${owner.phone}`}
                                                    className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                                                    title={owner.phone}
                                                >
                                                    <Phone className="h-5 w-5" />
                                                </a>
                                            )}
                                            {owner.email && (
                                                <a
                                                    href={`mailto:${owner.email}`}
                                                    className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                                                    title={owner.email}
                                                >
                                                    <Mail className="h-5 w-5" />
                                                </a>
                                            )}
                                            {!owner.phone && !owner.email && (
                                                <span className="text-slate-300 text-sm font-medium">Aucun contact</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black ${
                                            owner._count.horses > 0
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "bg-slate-100 text-slate-400 border border-slate-200"
                                        }`}>
                                            {owner._count.horses} {owner._count.horses > 1 ? "chevaux" : "cheval"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <div className="flex justify-end gap-3">
                                            <EditOwnerButton owner={owner} />
                                            <DeleteOwnerButton id={owner.id} name={owner.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {owners.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <UserCheck className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-lg">Aucun propriétaire</p>
                                                <p className="text-slate-500 font-medium">Commencez par ajouter votre premier propriétaire.</p>
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
