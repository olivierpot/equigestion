"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import UserForm from "./UserForm";

interface User {
    id: string;
    email: string;
    name: string | null;
}

interface EditUserButtonProps {
    user: User;
}

export default function EditUserButton({ user }: EditUserButtonProps) {
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
                <UserForm
                    user={user}
                    onSuccess={() => {}}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
