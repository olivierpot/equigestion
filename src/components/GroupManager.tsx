"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { createGroup, updateGroup, deleteGroup } from "@/lib/actions";

interface Group {
    id: string;
    name: string;
}

interface GroupManagerProps {
    initialGroups: Group[];
}

export default function GroupManager({ initialGroups }: GroupManagerProps) {
    const [groups, setGroups] = useState(initialGroups);
    const [newName, setNewName] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    async function handleAdd() {
        if (!newName.trim()) return;
        setIsPending(true);
        const result = await createGroup(newName);
        setIsPending(false);
        if (result.success && result.group) {
            setGroups([...groups, result.group]);
            setNewName("");
        }
    }

    async function handleUpdate(id: string) {
        if (!editingName.trim()) return;
        setIsPending(true);
        const result = await updateGroup(id, editingName);
        setIsPending(false);
        if (result.success && result.group) {
            setGroups(groups.map(g => g.id === id ? result.group : g));
            setEditingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ? Les chevaux rattachés n'auront plus de groupe.")) return;
        setIsPending(true);
        const result = await deleteGroup(id);
        setIsPending(false);
        if (result.success) {
            setGroups(groups.filter(g => g.id !== id));
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="space-y-6">
            {/* Add Group */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Ajouter un groupe</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ex: Groupe D, Box Nord..."
                        className="flex-1 px-4 py-2.5 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={isPending || !newName.trim()}
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="bg-card border rounded-2xl p-4 flex items-center justify-between hover:border-primary/20 transition-all"
                    >
                        {editingId === group.id ? (
                            <div className="flex-1 flex gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-background border rounded-lg focus:outline-none font-medium"
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(group.id)}
                                />
                                <button
                                    onClick={() => handleUpdate(group.id)}
                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground">{group.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(group.id);
                                            setEditingName(group.name);
                                        }}
                                        className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(group.id)}
                                        className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {groups.length === 0 && !isPending && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                        Aucun groupe créé. Commencez par en ajouter un.
                    </div>
                )}
            </div>
        </div>
    );
}
