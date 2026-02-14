"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import UserForm from "./UserForm";

export default function AddUserButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
                <UserPlus className="h-5 w-5" />
                Nouveau gérant
            </button>

            {isOpen && (
                <UserForm
                    onSuccess={() => {}}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
