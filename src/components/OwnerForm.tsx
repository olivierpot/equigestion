"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createOwner, updateOwner } from "@/lib/actions";

interface Owner {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
}

interface OwnerFormProps {
    owner?: Owner;
    onSuccess: () => void;
    onClose: () => void;
}

export default function OwnerForm({ owner, onSuccess, onClose }: OwnerFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEdit = !!owner;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        let result;
        if (isEdit && owner) {
            result = await updateOwner(owner.id, formData);
        } else {
            result = await createOwner(formData);
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
                        {isEdit ? `Modifier ${owner.name}` : "Nouveau propriétaire"}
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
                            defaultValue={owner?.name}
                            placeholder="Ex: Jean Dupont"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={owner?.email || ""}
                            placeholder="Ex: jean.dupont@email.com"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="phone" className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Téléphone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            defaultValue={owner?.phone || ""}
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
                                isEdit ? "Enregistrer" : "Créer le propriétaire"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
