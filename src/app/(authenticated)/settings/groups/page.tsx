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
                    className="p-3 hover:bg-white border-2 border-slate-100 rounded-2xl transition-all shadow-sm active:scale-90"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-900" />
                </a>
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Gestion des groupes</h1>
                    <p className="text-slate-500 mt-1 font-medium text-lg">Créez et organisez les emplacements de votre structure.</p>
                </div>
            </div>

            <GroupManager initialGroups={groups} />
        </div>
    );
}
