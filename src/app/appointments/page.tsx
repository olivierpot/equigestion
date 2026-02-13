import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

export default function AppointmentsPage() {
    const upcomingAppointments = [
        {
            id: 1,
            date: "7 Février",
            day: "Samedi",
            time: "09:00",
            type: "Maréchal-ferrant",
            provider: "Jean Sabot",
            horses: ["Bella", "Jupiter"],
            status: "Aujourd'hui"
        },
        {
            id: 2,
            date: "12 Février",
            day: "Jeudi",
            time: "14:30",
            type: "Vétérinaire (Vaccins)",
            provider: "Dr. Marc Vétérin",
            horses: ["Starlight"],
            status: "Prévu"
        },
        {
            id: 3,
            date: "15 Février",
            day: "Dimanche",
            time: "10:00",
            type: "Ostéopathe",
            provider: "Alice Ostéo",
            horses: ["Diane"],
            status: "Prévu"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Rendez-vous</h1>
                    <p className="text-muted-foreground mt-1">Planifiez et gérez les interventions professionnelles.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    Nouveau rendez-vous
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Février 2026
                            </h2>
                            <div className="flex gap-1">
                                <button className="p-2 hover:bg-secondary rounded-lg transition-colors border">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-secondary rounded-lg transition-colors border">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Minimal Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground uppercase mb-4 tracking-wider">
                            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span className="text-primary">Dim</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all text-sm font-medium
                     ${i + 1 === 7 ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' : 'hover:bg-secondary bg-background'}
                     ${[12, 15].includes(i + 1) ? 'border-primary/50 ring-1 ring-primary/20' : ''}
                   `}
                                >
                                    {i + 1}
                                    {[7, 12, 15].includes(i + 1) && (
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${i + 1 === 7 ? 'bg-white' : 'bg-primary animate-pulse'}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List of upcoming */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">À venir</h2>
                    <div className="space-y-4">
                        {upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${apt.status === "Aujourd'hui" ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                                    }`}>
                                    {apt.status}
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <span className="text-2xl font-black block leading-none">{apt.date.split(' ')[0]}</span>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{apt.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="flex-1 border-l pl-4">
                                        <h4 className="font-bold text-foreground leading-tight">{apt.type}</h4>
                                        <p className="text-sm text-primary font-medium mt-0.5">{apt.provider}</p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {apt.horses.map(h => (
                                                <span key={h} className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium">{h}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {apt.time}</span>
                                    <span className="flex items-center gap-1 group-hover:text-primary transition-colors cursor-pointer font-medium italic">
                                        Éditer
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
