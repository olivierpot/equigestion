import { ChevronLeft } from "lucide-react";
import SpecialtyManager from "@/components/SpecialtyManager";
import { getSpecialties } from "@/lib/actions";

export default async function SpecialtiesSettingsPage() {
    const specialties = await getSpecialties();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <a
                    href="/providers"
                    className="p-3 hover:bg-white border-2 border-slate-100 rounded-2xl transition-all shadow-sm active:scale-90"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-900" />
                </a>
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Spécialités professionnelles</h1>
                    <p className="text-slate-500 mt-1 font-medium text-lg">Gérez les types de métiers de vos prestataires.</p>
                </div>
            </div>

            <SpecialtyManager initialSpecialties={specialties} />
        </div>
    );
}
