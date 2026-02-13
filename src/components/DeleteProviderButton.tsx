"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProvider } from "@/lib/actions";

interface DeleteProviderButtonProps {
    id: string;
    name: string;
}

export default function DeleteProviderButton({ id, name }: DeleteProviderButtonProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        if (!confirm(`Tenter de supprimer ${name} ?`)) return;

        setIsPending(true);
        await deleteProvider(id);
        setIsPending(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 bg-red-50 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-100 transition-all active:scale-90 disabled:opacity-50"
            title="Supprimer"
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
    );
}
