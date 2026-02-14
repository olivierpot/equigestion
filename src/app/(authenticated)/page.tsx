import Link from "next/link";
import { Calendar, Cloud, CircleUser as Horse, Users, CheckCircle2, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react";
import { getHorses, getTodayAppointments, getActiveMedicalAlerts } from "@/lib/actions";

export default async function Home() {
  const [horses, appointments, medicalAlerts] = await Promise.all([
    getHorses(),
    getTodayAppointments(),
    getActiveMedicalAlerts(),
  ]);

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1 capitalize font-medium">{todayStr}</p>
        </div>
        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-xl border border-primary/10 rounded-2xl px-5 py-3 shadow-sm">
          <Cloud className="h-6 w-6 text-primary animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Météo locale</span>
            <span className="text-sm font-semibold">Ensoleillé, 12°C</span>
          </div>
        </div>
      </div>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pensionnaires", value: horses.length, icon: Horse, color: "bg-blue-500/10 text-blue-500", href: "/horses" },
          { label: "RDV du jour", value: appointments.length, icon: Calendar, color: "bg-amber-500/10 text-amber-500", href: "/appointments" },
          { label: "Alertes", value: medicalAlerts.length, icon: AlertTriangle, color: "bg-red-500/10 text-red-500", href: "/medical" },
        ].map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-card border border-primary/5 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="h-24 w-24" />
            </div>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black mt-1 leading-none">{stat.value}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments List */}
        <section className="bg-card border border-primary/5 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-7 border-b bg-muted/20 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">Rendez-vous du jour</h2>
            <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {appointments.length} Intervention{appointments.length > 1 ? 's' : ''}
            </div>
          </div>
          <div className="divide-y divide-border/50 flex-1">
            {appointments.map((apt: any) => (
              <div key={apt.id} className="p-7 hover:bg-muted/30 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-start gap-5">
                  <div className="text-center bg-secondary/50 rounded-2xl p-3 min-w-[70px] border border-transparent group-hover:border-primary/20 transition-all">
                    <span className="text-lg font-black block text-foreground leading-none">{apt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1 block">Heure</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
                      {apt.type === 'VETERINARY' ? 'Vétérinaire' :
                        apt.type === 'FARRIER' ? 'Maréchal-ferrant' :
                          apt.type === 'OSTEOPATHY' ? 'Ostéopathe' : apt.type}
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-2">
                      <span className="text-primary/70 font-bold underline underline-offset-4 decoration-2">
                        {apt.provider.name}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                      <span>{apt.horses.map((h: any) => h.name).join(", ")}</span>
                    </p>
                  </div>
                </div>
                <button className="p-3 rounded-2xl bg-secondary hover:bg-primary hover:text-primary-foreground transform active:scale-95 transition-all shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h4 className="font-bold text-foreground">Agenda calme</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                  Aucune intervention prévue pour ce jour. Profitez du calme !
                </p>
              </div>
            )}
          </div>
          <div className="p-5 bg-muted/10 border-t">
            <Link
              href="/appointments"
              className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors border border-dashed rounded-xl hover:border-primary/30 group"
            >
              Consulter le calendrier complet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Recent Health Alerts / Info */}
        <section className="bg-card border border-primary/5 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-7 border-b bg-muted/20 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">Santé & Alertes</h2>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${medicalAlerts.length > 0 ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
              {medicalAlerts.length > 0 ? `${medicalAlerts.length} Attention` : 'Tout est OK'}
            </div>
          </div>
          <div className="p-7 space-y-6 flex-1">
            {medicalAlerts.map((alert: any, i: number) => (
              <Link
                key={i}
                href="/medical"
                className="group p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-all duration-300 relative overflow-hidden block"
              >
                <div className="absolute top-0 right-0 p-4 transform translate-x-2 -translate-y-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 bg-red-500 text-white p-1 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-red-900 dark:text-red-200">Alerte : {alert.horse.name}</h4>
                    <p className="text-sm text-red-800/80 dark:text-red-300/80 mt-1 font-medium leading-relaxed">
                      {alert.symptoms}
                      {alert.history[0]?.observation && (
                        <span className="block mt-2 text-xs italic opacity-70 border-l-2 border-red-200 pl-3">
                          Dernière obs: "{alert.history[0].observation}"
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {medicalAlerts.length === 0 && (
              <Link
                href="/medical"
                className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-4 hover:bg-green-500/10 transition-colors"
              >
                <div className="bg-green-500 text-white p-2 rounded-xl">
                  <Horse className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                  Tous les chevaux sont en pleine forme aujourd'hui.
                </p>
              </Link>
            )}

            <div className="space-y-4 pt-4">
              <h4 className="text-xs font-black uppercase tracking-[.2em] text-muted-foreground/60 mb-2">Historique récent</h4>
              {[
                { title: "Vermifuge global", status: "terminé", color: "bg-green-500" },
                { title: "Rapport Maréchalerie - Jupiter", status: "disponible", color: "bg-blue-500" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href="/medical"
                  className="flex items-center justify-between p-4 rounded-2xl border bg-background/40 hover:border-primary/20 hover:bg-background/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></div>
                    <span className="text-sm font-bold group-hover:text-foreground transition-colors">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{item.status}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-5 bg-muted/10 border-t mt-auto">
            <Link
              href="/medical"
              className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors border border-dashed rounded-xl hover:border-primary/30 group"
            >
              Voir tout le suivi médical
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
