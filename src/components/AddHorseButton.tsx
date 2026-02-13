"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import HorseForm from "./HorseForm";

interface Owner {
    id: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
}

interface AddHorseButtonProps {
    owners: Owner[];
    groups: Group[];
}

export default function AddHorseButton({ owners, groups }: AddHorseButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95"
            >
                <Plus className="h-5 w-5" />
                Ajouter un cheval
            </button>

            {isOpen && (
                <HorseForm
                    owners={owners}
                    groups={groups}
                    onSuccess={() => { }}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
