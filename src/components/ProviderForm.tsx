"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createProvider, updateProvider } from "@/lib/actions";

interface Specialty {
    id: string;
    name: string;
}

interface Provider {
    id: string;
    name: string;
    phone?: string | null;
    specialtyId: string;
}

interface ProviderFormProps {
    provider?: Provider; // If provided, we are in EDIT mode
    specialties: Specialty[];
    onSuccess: () => void;
    onClose: () => void;
}

export default function ProviderForm({ provider, specialties, onSuccess, onClose }: ProviderFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEdit = !!provider;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        let result;
        if (isEdit && provider) {
            result = await updateProvider(provider.id, formData);
        } else {
            result = await createProvider(formData);
        }

        setIsPending(false);

        if (result.success) {
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Une erreur est survenue");
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white border-2 border-slate-200 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                        {isEdit ? `Modifier ${provider.name}` : "Nouveau professionnel"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-200 rounded-2xl transition-all active:scale-90"
                    >
                        <X className="h-6 w-6 text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label htmlFor="name" className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Nom complet *
                        </label>
                        <input
                            id="name"
                            name="name"
                            required
                            defaultValue={provider?.name}
                            placeholder="Ex: Dr. Marc Vétérin"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="specialtyId" className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Spécialité / Métier *
                        </label>
                        <div className="relative">
                            <select
                                id="specialtyId"
                                name="specialtyId"
                                required
                                defaultValue={provider?.specialtyId || ""}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            >
                                <option value="">Sélectionnez une spécialité</option>
                                {specialties.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="phone" className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Téléphone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            defaultValue={provider?.phone || ""}
                            placeholder="Ex: 06 12 34 56 78"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/30 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {isEdit ? "Mise à jour..." : "Création..."}
                                </>
                            ) : (
                                isEdit ? "Enregistrer" : "Créer le contact"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
