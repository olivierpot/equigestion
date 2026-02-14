"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "Compte désactivé") {
                    setError("Votre compte a été désactivé. Contactez l'administrateur.");
                } else {
                    setError("Email ou mot de passe incorrect");
                }
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <label
                    htmlFor="email"
                    className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
            </div>

            <div className="space-y-3">
                <label
                    htmlFor="password"
                    className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1"
                >
                    Mot de passe
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Votre mot de passe"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/30 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Connexion...
                    </>
                ) : (
                    <>
                        <LogIn className="h-5 w-5" />
                        Se connecter
                    </>
                )}
            </button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-extrabold text-2xl shadow-xl shadow-primary/20">
                            Eq
                        </div>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        Equigestion
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8">
                    <Suspense fallback={<div className="py-8 text-center text-slate-400">Chargement...</div>}>
                        <LoginForm />
                    </Suspense>
                </div>

                <p className="text-center text-slate-400 text-sm mt-6 font-medium">
                    Gestion de pension équine
                </p>
            </div>
        </div>
    );
}
