"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import OwnerForm from "./OwnerForm";

interface Owner {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
}

interface EditOwnerButtonProps {
    owner: Owner;
}

export default function EditOwnerButton({ owner }: EditOwnerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-slate-50 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                title="Modifier"
            >
                <Pencil className="h-4 w-4" />
            </button>

            {isOpen && (
                <OwnerForm
                    owner={owner}
                    onSuccess={() => { }}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
