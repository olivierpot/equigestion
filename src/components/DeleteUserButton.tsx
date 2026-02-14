"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/lib/admin-actions";

interface DeleteUserButtonProps {
    id: string;
    name: string;
}

export default function DeleteUserButton({ id, name }: DeleteUserButtonProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        if (!confirm(`Supprimer ${name} et toutes ses données ? Cette action est irréversible.`)) return;

        setIsPending(true);
        const result = await deleteUser(id);
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
