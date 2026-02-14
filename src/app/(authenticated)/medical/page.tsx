import { Stethoscope, Activity, FileText, AlertTriangle, CheckCircle2, Search } from "lucide-react";

export default function MedicalPage() {
    const alerts = [
        {
            horse: "Starlight",
            issue: "Température élevée (38.8°C)",
            since: "Ce matin",
            severity: "Warning",
        },
        {
            horse: "Jupiter",
            issue: "Blessure légère antérieur gauche",
            since: "Hier",
            severity: "Info",
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Suivi Médical</h1>
                    <p className="text-muted-foreground mt-1">Tracez les soins et surveillez la santé des pensionnaires.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card border font-medium rounded-xl hover:bg-secondary transition-all">
                        <FileText className="h-5 w-5" />
                        Rapports
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                        <Plus className="h-5 w-5" />
                        Nouveau soin
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Alerts and Stats */}
                <div className="space-y-8">
                    <section className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                Alertes actives
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {alerts.map((alert, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex gap-4 ${alert.severity === 'Warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-900' : 'bg-blue-50 border-blue-100 text-blue-900'
                                    }`}>
                                    <div className="shrink-0 font-bold">!</div>
                                    <div>
                                        <h4 className="font-bold">{alert.horse}</h4>
                                        <p className="text-sm opacity-90">{alert.issue}</p>
                                        <p className="text-[11px] mt-2 font-medium opacity-70 italic">{alert.since}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold mb-4">Statistiques soins</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Vaccins à jour</span>
                                <span className="font-bold">22/24</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Vermifugation</span>
                                <span className="font-bold">100%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Timeline of Care */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Journal des soins</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input type="text" placeholder="Filtrer par cheval..." className="pl-10 pr-4 py-2 text-sm bg-card border rounded-lg outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/5 before:to-transparent">
                        {[
                            { date: "06 Fév.", time: "11:20", horse: "Bella", care: "Vermifuge (Equest)", provider: "Gérant" },
                            { date: "06 Fév.", time: "09:45", horse: "Starlight", care: "Prise de température: 38.6°C", provider: "Staff" },
                            { date: "05 Fév.", time: "16:15", horse: "Jupiter", care: "Soins plaie local", provider: "Gérant" },
                            { date: "04 Fév.", time: "14:00", horse: "Tous", care: "Passage dentiste", provider: "Alice Ostéo" },
                        ].map((item, i) => (
                            <div key={i} className="relative pl-12 group">
                                <div className="absolute left-0 mt-1 h-10 w-10 flex items-center justify-center rounded-xl bg-background border-2 border-primary/20 group-hover:border-primary transition-colors">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                                <div className="bg-card border rounded-2xl p-5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary">{item.date} — {item.time}</span>
                                        <span className="text-[10px] font-medium px-2 py-0.5 bg-secondary rounded-full">{item.provider}</span>
                                    </div>
                                    <h4 className="font-bold text-lg">{item.horse}</h4>
                                    <p className="text-muted-foreground text-sm mt-1">{item.care}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
