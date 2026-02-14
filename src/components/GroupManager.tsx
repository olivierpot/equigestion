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
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black mb-6 text-slate-900">Ajouter un groupe</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ex: Groupe D, Box Nord..."
                        className="flex-1 px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={isPending || !newName.trim()}
                        className="px-8 py-3.5 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center justify-between hover:border-primary/20 transition-all shadow-sm"
                    >
                        {editingId === group.id ? (
                            <div className="flex-1 flex gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-primary font-bold text-slate-900"
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(group.id)}
                                />
                                <button
                                    onClick={() => handleUpdate(group.id)}
                                    className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <Check className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="p-2 bg-slate-400 text-white rounded-xl hover:bg-slate-500 transition-colors shadow-lg shadow-slate-400/20"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="font-black text-slate-900 text-lg">{group.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(group.id);
                                            setEditingName(group.name);
                                        }}
                                        className="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(group.id)}
                                        className="p-2.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {groups.length === 0 && !isPending && (
                    <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem] font-bold">
                        Aucun groupe créé. Commencez par en ajouter un.
                    </div>
                )}
            </div>
        </div>
    );
}
