"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toggleUserActive } from "@/lib/admin-actions";

interface ToggleUserButtonProps {
    id: string;
    isActive: boolean;
}

export default function ToggleUserButton({ id, isActive }: ToggleUserButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [currentState, setCurrentState] = useState(isActive);

    async function handleToggle() {
        setIsPending(true);
        const result = await toggleUserActive(id);
        setIsPending(false);

        if (result.success) {
            setCurrentState(result.isActive!);
        } else if (result.error) {
            alert(result.error);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
                currentState
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : currentState ? (
                "Actif"
            ) : (
                "Inactif"
            )}
        </button>
    );
}
