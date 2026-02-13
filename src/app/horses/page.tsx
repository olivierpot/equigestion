import { Search, Filter, ChevronRight } from "lucide-react";
import { getHorses, getOwners, getGroups } from "@/lib/actions";
import AddHorseButton from "@/components/AddHorseButton";
import EditHorseButton from "@/components/EditHorseButton";

export default async function HorsesPage() {
    const [horses, owners, groups] = await Promise.all([
        getHorses(),
        getOwners(),
        getGroups(),
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Pensionnaires</h1>
                    <p className="text-muted-foreground mt-1">Gérez et suivez tous les chevaux de la structure.</p>
                </div>
                <div className="flex gap-3">
                    <AddHorseButton owners={owners} groups={groups} />
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher un cheval, un propriétaire..."
                        className="w-full pl-10 pr-4 py-2 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-secondary transition-colors text-sm font-medium">
                        <Filter className="h-4 w-4" />
                        Filtrer
                    </button>
                    <a
                        href="/settings/groups"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-secondary transition-colors text-sm font-medium"
                    >
                        Gérer les groupes
                    </a>
                </div>
            </div>

            {/* Horse Grid */}
            {horses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {horses.map((horse) => (
                        <div
                            key={horse.id}
                            className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-transparent hover:border-primary/20"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                {horse.photoUrl ? (
                                    <img
                                        src={horse.photoUrl}
                                        alt={horse.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-muted-foreground">
                                        Pas de photo
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm bg-green-500 text-white">
                                        En forme
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditHorseButton horse={horse} owners={owners} groups={groups} />
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{horse.name}</h3>
                                        <p className="text-sm text-muted-foreground">{horse.breed || 'Race non précisée'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="text-muted-foreground w-24">Proprio :</span>
                                        <span className="font-medium text-foreground truncate">{horse?.owner?.name || 'Inconnu'}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="text-muted-foreground w-24">Groupe :</span>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                                            {horse?.group?.name || 'Non défini'}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-2 px-4 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1 group/btn">
                                    Voir la fiche
                                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card border rounded-2xl p-12 text-center">
                    <p className="text-muted-foreground">Aucun pensionnaire trouvé dans la base de données.</p>
                    <div className="mt-4">
                        <AddHorseButton owners={owners} groups={groups} />
                    </div>
                </div>
            )}
        </div>
    );
}
