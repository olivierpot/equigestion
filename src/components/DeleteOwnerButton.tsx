"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteOwner } from "@/lib/actions";

interface DeleteOwnerButtonProps {
    id: string;
    name: string;
}

export default function DeleteOwnerButton({ id, name }: DeleteOwnerButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        if (!confirm(`Supprimer ${name} ?`)) return;

        setIsPending(true);
        setError(null);

        const result = await deleteOwner(id);

        setIsPending(false);

        if (!result.success && result.error) {
            alert(result.error);
        }
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
