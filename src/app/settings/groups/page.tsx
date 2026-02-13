import { getGroups } from "@/lib/actions";
import GroupManager from "@/components/GroupManager";
import { ChevronLeft } from "lucide-react";

export default async function GroupsPage() {
    const groups = await getGroups();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <a
                    href="/horses"
                    className="p-2 hover:bg-card border rounded-xl transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </a>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Groupes</h1>
                    <p className="text-muted-foreground mt-1">Créez et organisez les emplacements de votre structure.</p>
                </div>
            </div>

            <GroupManager initialGroups={groups} />
        </div>
    );
}
