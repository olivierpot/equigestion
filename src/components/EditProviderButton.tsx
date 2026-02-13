"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import ProviderForm from "./ProviderForm";

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

interface EditProviderButtonProps {
    provider: Provider;
    specialties: Specialty[];
}

export default function EditProviderButton({ provider, specialties }: EditProviderButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                title="Modifier"
            >
                <Edit2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <ProviderForm
                    provider={provider}
                    specialties={specialties}
                    onSuccess={() => { }}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
