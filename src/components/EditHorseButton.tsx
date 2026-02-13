"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import HorseForm from "./HorseForm";

interface Owner {
    id: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
}

interface Horse {
    id: string;
    name: string;
    breed?: string | null;
    groupId?: string | null;
    ownerId: string;
    foodRation?: string | null;
}

interface EditHorseButtonProps {
    horse: Horse;
    owners: Owner[];
    groups: Group[];
}

export default function EditHorseButton({ horse, owners, groups }: EditHorseButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="p-2 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-lg text-foreground shadow-sm hover:bg-white dark:hover:bg-black transition-colors"
                title="Modifier le cheval"
            >
                <Edit2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <HorseForm
                    horse={horse}
                    owners={owners}
                    groups={groups}
                    onSuccess={() => { }}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
