import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, ArrowRight, Bot, CalendarDays, Check, ChevronRight, ClipboardList,
  CloudUpload, Droplets, FileHeart, HeartPulse, Home, Languages, Lightbulb, Menu, MessageCircle,
  Mic, Moon, Pill, Plus, Settings, ShieldCheck, Stethoscope, UserRound, Watch, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { UIMessage } from "ai";

import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { answerHealthQuestion, compareRows, journeyEvents, records, translations, type ChatThread, type JourneyEvent, type Language } from "@/lib/health-data";
import { defaultHealthState, loadHealthState, saveHealthState, type HealthState } from "@/lib/health-store";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "journey" | "records" | "copilot" | "medications" | "appointments" | "insights" | "profile" | "settings";

const sectionPath: Record<Section, string> = {
  dashboard: "/", journey: "/journey", records: "/records", copilot: "/copilot", medications: "/medications",
  appointments: "/appointments", insights: "/insights", profile: "/profile", settings: "/settings",
};

const icons: Record<Section, typeof Home> = {
  dashboard: Home, journey: Activity, records: FileHeart, copilot: Bot, medications: Pill,
  appointments: CalendarDays, insights: Lightbulb, profile: UserRound, settings: Settings,
};

const eventIcon = { visit: Stethoscope, test: Activity, result: FileHeart, prescription: Pill, followup: HeartPulse };

function BrandMark() {
  return <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft"><HeartPulse className="size-5" /><span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-sidebar bg-health-green" /></div>;
}

export function HealthPilotApp({ section, threadId }: { section: Section; threadId?: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<HealthState>(defaultHealthState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<JourneyEvent | null>(null);
  const [toast, setToast] = useState("");
  const language = state.language;
  const t = translations[language];

  useEffect(() => {
    setState(loadHealthState());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) saveHealthState(state);
  }, [hydrated, state]);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const createThread = (seed?: string) => {
    const id = crypto.randomUUID();
    const thread: ChatThread = { id, title: seed?.slice(0, 34) || "New health question", updatedAt: Date.now(), messages: [] };
    setState((current) => ({ ...current, threads: [thread, ...current.threads] }));
    void navigate({ to: "/chat/$threadId", params: { threadId: id }, search: seed ? { q: seed } : {} });
  };

  const setLanguage = (next: Language) => setState((current) => ({ ...current, language: next }));

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-overlay md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:sticky md:top-0 md:h-svh md:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center gap-3 px-5 py-6">
          <BrandMark /><div className="min-w-0"><p className="font-display text-lg font-bold leading-none">HealthPilot</p><p className="mt-1 text-[10px] font-bold uppercase text-primary">AI Copilot</p></div>
          <Button className="ml-auto md:hidden" size="icon" variant="ghost" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {(Object.keys(sectionPath) as Section[]).map((item) => {
            const Icon = icons[item];
            const active = item === section || (item === "copilot" && section === "copilot");
            return <Link key={item} to={sectionPath[item]} className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-accent text-sidebar-primary shadow-inset")}><Icon className="size-4 shrink-0" /><span>{t[item]}</span></Link>;
          })}
        </nav>
        <div className="m-4 border-t border-sidebar-border pt-4">
          <div className="flex gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><p>HealthPilot AI organizes health information. It does not diagnose or replace healthcare professionals.</p></div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl lg:px-8">
          <Button className="md:hidden" size="icon" variant="ghost" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{t[section]}</p><p className="truncate text-xs text-muted-foreground">ABHA 91-2387-4456-1209</p></div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center rounded-md border border-border bg-muted p-1 sm:flex">
              <button className={cn("rounded px-2 py-1 text-xs font-semibold", language === "en" && "bg-background text-primary shadow-sm")} onClick={() => setLanguage("en")}>English</button>
              <button className={cn("rounded px-2 py-1 text-xs font-semibold", language === "te" && "bg-background text-primary shadow-sm")} onClick={() => setLanguage("te")}>తెలుగు</button>
            </div>
            <Button size="icon" variant="outline" onClick={() => setLanguage(language === "en" ? "te" : "en")} aria-label="Switch language" className="sm:hidden"><Languages /></Button>
            <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setDeviceOpen(true)}><Watch />{state.deviceConnected ? "Synced" : t.connect}</Button>
            <div className="grid size-9 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">AN</div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-8 lg:py-8">
          {section === "dashboard" && <Dashboard language={language} state={state} onUpload={() => setUploadOpen(true)} onAsk={() => createThread()} onDevice={() => setDeviceOpen(true)} onEvent={setSelectedEvent} onAlert={() => setAlertOpen(true)} />}
          {section === "journey" && <JourneyPage onEvent={setSelectedEvent} />}
          {section === "records" && <RecordsPage onUpload={() => setUploadOpen(true)} onAlert={() => setAlertOpen(true)} onAsk={(q) => createThread(q)} />}
          {section === "copilot" && <CopilotPage state={state} setState={setState} threadId={threadId} onNew={() => createThread()} />}
          {section === "medications" && <MedicationsPage state={state} setState={setState} notify={setToast} />}
          {section === "appointments" && <AppointmentsPage onAsk={(q) => createThread(q)} />}
          {section === "insights" && <InsightsPage onAsk={(q) => createThread(q)} />}
          {section === "profile" && <ProfilePage />}
          {section === "settings" && <SettingsPage state={state} setState={setState} />}
        </main>
      </div>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSaved={() => { setUploadOpen(false); setToast("Record saved and connected to your journey"); }} onCritical={() => { setUploadOpen(false); setAlertOpen(true); }} />
      <DeviceDialog open={deviceOpen} onOpenChange={setDeviceOpen} onConnect={() => { setState((current) => ({ ...current, deviceConnected: true, metrics: { steps: 8472, heartRate: 74, sleep: 7.6, water: 7 } })); setDeviceOpen(false); setToast("Wearable data synchronized"); }} />
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} />
      <EventDialog event={selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)} onAsk={(q) => { setSelectedEvent(null); createThread(q); }} />
      {toast && <div className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-xl"><Check className="size-4 text-health-green" />{toast}</div>}
    </div>
  );
}

function Dashboard({ language, state, onUpload, onAsk, onDevice, onEvent, onAlert }: { language: Language; state: HealthState; onUpload: () => void; onAsk: () => void; onDevice: () => void; onEvent: (e: JourneyEvent) => void; onAlert: () => void }) {
  const t = translations[language];
  return <div className="space-y-8">
    <section className="relative overflow-hidden rounded-xl border border-border bg-hero p-6 shadow-soft sm:p-8 lg:p-10">
      <div className="relative z-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase text-primary">{t.greeting}</p><h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{t.hero}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{t.subtitle}</p><div className="mt-7 flex flex-wrap gap-3"><Button size="lg" onClick={onUpload}><CloudUpload />{t.upload}</Button><Button size="lg" variant="outline" onClick={onAsk}><Bot />{t.ask}</Button><Button size="lg" variant="ghost" onClick={onDevice}><Watch />{state.deviceConnected ? "Device synced" : t.connect}</Button></div></div>
      <div className="mt-10 grid grid-cols-2 gap-y-6 border-t border-border/70 pt-7 sm:grid-cols-4">
        {[[FileHeart,"Medical Records"],[Bot,"AI Understanding"],[Activity,"Connected Journey"],[MessageCircle,"Doctor Conversation"]].map(([I,label],index) => { const Icon = I as typeof FileHeart; return <div key={label as string} className="relative flex items-center gap-3 text-xs font-semibold sm:flex-col sm:text-center"><div className="grid size-10 place-items-center rounded-lg bg-background text-primary shadow-sm"><Icon /></div><span>{label as string}</span>{index < 3 && <div className="absolute left-[70%] top-5 hidden h-px w-[60%] border-t border-dashed border-primary/40 sm:block" />}</div>; })}
      </div>
    </section>
    <section><SectionHeading eyebrow="The story of your health" title="Your Health Journey" action={<Link to="/journey" className="text-sm font-semibold text-primary">Open journey <ArrowRight className="inline size-4" /></Link>} /><JourneyStrip onEvent={onEvent} /></section>
    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <div className="space-y-5"><div className="rounded-lg border border-border bg-card p-6 shadow-soft"><p className="text-xs font-bold uppercase text-muted-foreground">Simple health summary</p><p className="mt-3 font-display text-2xl leading-snug">Over the last two months you had 2 blood tests, 1 doctor visit and 2 new medicines. Your next review is on 14 October.</p></div><div><SectionHeading eyebrow="What needs your attention?" title="A clear next step" /><div className="grid gap-4 sm:grid-cols-2"><ActionCard icon={Activity} title="4 values changed in your latest report" action="See what changed" to="/records" /><button onClick={onAlert} className="text-left"><ActionCard icon={AlertTriangle} title="Know what a critical record alert looks like" action="View safety alert" /></button></div></div></div>
      <div className="space-y-4"><UpcomingCard /><MetricGrid state={state} /></div>
    </section>
    <section><SectionHeading eyebrow="Recent AI insights" title="Understand the change, not just the number" /><div className="grid gap-4 md:grid-cols-3"><InsightCard title="Haemoglobin moved upward" body="The latest report is 0.8 g/dL higher than August." source="2 blood reports" /><InsightCard title="Vitamin D improved" body="The measured value increased from 16 to 24 ng/mL." source="2 blood reports" /><InsightCard title="A review is approaching" body="Bring your latest report and current medication list." source="Appointment · 14 Oct" /></div></section>
  </div>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) { return <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="text-xs font-bold uppercase text-primary">{eyebrow}</p><h2 className="mt-1 truncate font-display text-2xl font-semibold sm:text-3xl">{title}</h2></div>{action}</div>; }

function JourneyStrip({ onEvent }: { onEvent: (e: JourneyEvent) => void }) { return <div className="overflow-x-auto rounded-lg border border-border bg-card p-6 shadow-soft"><div className="relative grid min-w-[760px] grid-cols-5 gap-4 before:absolute before:left-[9%] before:right-[9%] before:top-7 before:border-t before:border-dashed before:border-primary/50">{journeyEvents.map((event) => { const Icon = eventIcon[event.type]; return <button key={event.id} onClick={() => onEvent(event)} className="group relative z-10 flex flex-col items-center text-center"><div className="grid size-14 place-items-center rounded-full border border-primary/30 bg-background text-primary transition-transform group-hover:-translate-y-1 group-hover:shadow-soft"><Icon className="size-5" /></div><span className="mt-3 text-[10px] font-bold text-muted-foreground">{event.shortDate}</span><span className="mt-1 text-sm font-semibold">{event.title}</span></button>; })}</div></div>; }

function ActionCard({ icon: Icon, title, action, to }: { icon: typeof Activity; title: string; action: string; to?: string }) { const body = <div className="rounded-lg border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5"><Icon className="size-5 text-primary" /><p className="mt-5 font-semibold">{title}</p><p className="mt-2 text-sm font-semibold text-primary">{action} <ArrowRight className="inline size-4" /></p></div>; return to ? <Link to={to}>{body}</Link> : body; }
function UpcomingCard() { return <div className="rounded-lg border border-border bg-card p-5 shadow-soft"><p className="text-xs font-bold uppercase text-muted-foreground"><CalendarDays className="mr-2 inline size-4" />Upcoming appointment</p><p className="mt-4 text-lg font-bold">Dr. Kiran Reddy</p><p className="text-sm text-muted-foreground">Wed, 14 Oct · 10:30 AM</p><Button asChild className="mt-4" size="sm"><Link to="/appointments">Prepare for my visit <ArrowRight /></Link></Button></div>; }
function MetricGrid({ state }: { state: HealthState }) { const m = state.metrics; return <div className="grid grid-cols-2 gap-3">{[[Activity,m.steps.toLocaleString(),"Steps"],[HeartPulse,`${m.heartRate} bpm`,"Heart rate"],[Moon,`${m.sleep} hrs`,"Sleep"],[Droplets,`${m.water}/8`,"Water"]].map(([I,value,label]) => { const Icon=I as typeof Activity; return <div key={label as string} className="rounded-lg border border-border bg-card p-4"><Icon className="size-4 text-primary" /><p className="mt-3 text-lg font-bold">{value as string}</p><p className="text-xs text-muted-foreground">{label as string}</p></div>; })}</div>; }
function InsightCard({ title, body, source }: { title: string; body: string; source: string }) { return <div className="rounded-lg border border-border bg-card p-5 shadow-soft"><Lightbulb className="size-5 text-warning" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p><p className="mt-4 text-xs font-semibold text-primary">Why am I seeing this? · {source}</p></div>; }

function JourneyPage({ onEvent }: { onEvent: (e: JourneyEvent) => void }) { return <div><SectionHeading eyebrow="Connected medical history" title="Your Health Journey" /><p className="mb-8 max-w-2xl text-muted-foreground">Follow the thread from first test to next conversation. Every connection is grounded in your saved records.</p><div className="relative mx-auto max-w-4xl space-y-0 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-border sm:before:left-1/2">{journeyEvents.map((event,index) => { const Icon=eventIcon[event.type]; return <button key={event.id} onClick={() => onEvent(event)} className={cn("relative grid w-full grid-cols-[56px_minmax(0,1fr)] gap-4 pb-8 text-left sm:grid-cols-[1fr_72px_1fr]", index%2 ? "" : "")}><div className={cn("hidden rounded-lg border border-border bg-card p-5 shadow-soft sm:block", index%2 ? "invisible" : "")}><p className="text-xs font-bold text-primary">{event.shortDate}</p><h3 className="mt-2 font-semibold">{event.title}</h3><p className="mt-2 text-sm text-muted-foreground">{event.detail}</p></div><div className="z-10 grid size-14 place-items-center rounded-full border border-primary/30 bg-background text-primary shadow-sm"><Icon /></div><div className={cn("rounded-lg border border-border bg-card p-5 shadow-soft", index%2 ? "" : "sm:invisible")}><p className="text-xs font-bold text-primary">{event.shortDate}</p><h3 className="mt-2 font-semibold">{event.title}</h3><p className="mt-2 text-sm text-muted-foreground">{event.detail}</p></div></button>; })}</div></div>; }

function RecordsPage({ onUpload, onAlert, onAsk }: { onUpload: () => void; onAlert: () => void; onAsk: (q: string) => void }) { const [record, setRecord] = useState(records[0]); return <div className="space-y-8"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><SectionHeading eyebrow="Medical record intelligence" title="Records that explain themselves" /><Button onClick={onUpload}><CloudUpload />Upload record</Button></div><div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]"><div className="space-y-2">{records.map((item) => <button key={item.id} onClick={() => setRecord(item)} className={cn("w-full rounded-lg border p-4 text-left transition-colors", record.id===item.id ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted")}><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-background text-primary"><FileHeart /></div><div className="min-w-0"><p className="truncate font-semibold">{item.name}</p><p className="text-xs text-muted-foreground">{item.type} · {item.date}</p></div></div></button>)}</div><div className="rounded-lg border border-border bg-card p-6 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">{record.type}</p><h2 className="mt-1 font-display text-3xl font-semibold">{record.name}</h2><p className="mt-1 text-sm text-muted-foreground">{record.date}</p></div><Button variant="outline" onClick={() => onAsk(`Explain ${record.name}`)}><Bot />Ask Copilot</Button></div><Tabs defaultValue="simple" className="mt-6"><TabsList><TabsTrigger value="medical">Medical</TabsTrigger><TabsTrigger value="simple">Simple</TabsTrigger><TabsTrigger value="questions">Questions</TabsTrigger></TabsList><TabsContent value="medical" className="mt-5 rounded-lg bg-muted p-5 text-sm leading-7">Hb 11.6 g/dL · 25-OH Vitamin D 24 ng/mL · FBS 94 mg/dL. Compare with prior specimen dated 12 Aug 2026.</TabsContent><TabsContent value="simple" className="mt-5 rounded-lg bg-muted p-5"><p className="text-sm leading-7">{record.summary} This is a plain-language description of the recorded values, not a diagnosis.</p></TabsContent><TabsContent value="questions" className="mt-5 rounded-lg bg-muted p-5"><ul className="space-y-3 text-sm"><li>• Are these changes progressing as expected?</li><li>• Should I continue both medicines at the same dose?</li><li>• When should this test be repeated?</li></ul></TabsContent></Tabs></div></div><ComparisonTool onAsk={onAsk} /><button onClick={onAlert} className="text-sm font-semibold text-destructive underline-offset-4 hover:underline">Preview a critical record safety alert</button></div>; }

function ComparisonTool({ onAsk }: { onAsk: (q: string) => void }) { return <section><SectionHeading eyebrow="What changed?" title="Previous vs latest blood report" action={<Button variant="outline" onClick={() => onAsk("Explain what changed between my blood reports")}>Explain the changes</Button>} /><div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft"><div className="grid grid-cols-[minmax(110px,1fr)_1fr_auto_1fr] gap-3 border-b border-border bg-muted px-4 py-3 text-xs font-bold uppercase text-muted-foreground"><span>Marker</span><span>12 Aug</span><span /><span>15 Sep</span></div>{compareRows.map((row) => <div key={row.label} className="grid grid-cols-[minmax(110px,1fr)_1fr_auto_1fr] items-center gap-3 border-b border-border px-4 py-4 last:border-0"><div><p className="font-semibold">{row.label}</p><p className="mt-1 hidden text-xs text-muted-foreground sm:block">{row.note}</p></div><span className="text-sm text-muted-foreground">{row.before}</span><ArrowRight className="size-4 text-primary" /><span className="text-sm font-bold text-primary">{row.after}</span></div>)}</div></section>; }

function CopilotPage({ state, setState, threadId, onNew }: { state: HealthState; setState: (updater: (s: HealthState) => HealthState) => void; threadId?: string; onNew: () => void }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"ready"|"submitted">("ready");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const active = state.threads.find((thread) => thread.id === threadId);
  const thread = active ?? state.threads[0];
  useEffect(() => { if (!threadId && thread) void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } }); }, [navigate, thread, threadId]);
  useEffect(() => { textareaRef.current?.focus(); }, [threadId, status]);
  const uiMessages = useMemo<UIMessage[]>(() => (thread?.messages ?? []).map((m) => ({ id: m.id, role: m.role, parts: [{ type: "text", text: m.text }] })), [thread]);

  const submit = (text: string) => {
    const clean = text.trim(); if (!clean) return;
    let target = thread;
    if (!target) {
      const id = crypto.randomUUID();
      target = { id, title: clean.slice(0,34), updatedAt: Date.now(), messages: [] };
      setState((current) => ({ ...current, threads: [target as ChatThread, ...current.threads] }));
      void navigate({ to: "/chat/$threadId", params: { threadId: id } });
    }
    const targetId = target.id;
    const userMessage = { id: crypto.randomUUID(), role: "user" as const, text: clean };
    setState((current) => ({ ...current, threads: current.threads.map((item) => item.id===targetId ? { ...item, title: item.messages.length ? item.title : clean.slice(0,34), updatedAt: Date.now(), messages: [...item.messages,userMessage] } : item) }));
    setInput(""); setStatus("submitted");
    window.setTimeout(() => {
      const answer = answerHealthQuestion(clean, state.language);
      setState((current) => ({ ...current, threads: current.threads.map((item) => item.id===targetId ? { ...item, updatedAt: Date.now(), messages: [...item.messages,{ id: crypto.randomUUID(), role: "assistant" as const, text: answer.text, sources: answer.sources }] } : item) }));
      setStatus("ready");
      if ("speechSynthesis" in window) { const utterance = new SpeechSynthesisUtterance(answer.text.replaceAll("**","")); utterance.lang = state.language === "te" ? "te-IN" : "en-IN"; window.speechSynthesis.speak(utterance); }
    }, 700);
  };
  const startVoice = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => { lang:string; start:()=>void; onresult:(e:{results:{0:{0:{transcript:string}}}[]})=>void; onerror:()=>void }; webkitSpeechRecognition?: new () => { lang:string; start:()=>void; onresult:(e:{results:{0:{0:{transcript:string}}}[]})=>void; onerror:()=>void } }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => { lang:string; start:()=>void; onresult:(e:{results:{0:{0:{transcript:string}}}[]})=>void; onerror:()=>void } }).webkitSpeechRecognition;
    if (!SpeechRecognition) { textareaRef.current?.focus(); setInput("Voice input isn't supported here. Type your question instead."); return; }
    const recognition = new SpeechRecognition(); recognition.lang = state.language === "te" ? "te-IN" : "en-IN"; recognition.onresult = (event) => setInput(event.results[0][0].transcript); recognition.onerror = () => textareaRef.current?.focus(); recognition.start();
  };
  return <div className="grid min-h-[calc(100svh-7.5rem)] gap-5 lg:grid-cols-[280px_minmax(0,1fr)]"><aside className="rounded-lg border border-border bg-card p-4 shadow-soft"><div className="flex items-center justify-between"><h2 className="font-semibold">Conversations</h2><Button size="icon" onClick={onNew} aria-label="New chat"><Plus /></Button></div><div className="mt-4 space-y-2">{state.threads.map((item) => <Link key={item.id} to="/chat/$threadId" params={{ threadId:item.id }} className={cn("block rounded-lg p-3 text-sm", item.id===thread?.id ? "bg-accent text-accent-foreground" : "hover:bg-muted")}><p className="truncate font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.messages.length} messages</p></Link>)}</div></aside><section className="flex min-h-[650px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft"><header className="border-b border-border px-5 py-4"><div className="flex items-center gap-3"><BrandMark /><div><h1 className="font-semibold">HealthPilot Copilot</h1><p className="text-xs text-muted-foreground">Answers from your connected records only</p></div></div></header><Conversation className="min-h-0 flex-1"><ConversationContent className="mx-auto w-full max-w-3xl p-5">{!uiMessages.length && <ConversationEmptyState icon={<HeartPulse className="size-10 text-primary" />} title="Ask about your health journey" description="Try “What changed?”, “Show my medicines”, or “How should I prepare for my visit?”"><div className="grid gap-2 sm:grid-cols-2">{["What changed in my reports?","What medicines am I taking?","Prepare questions for my doctor","How should I handle my tiredness?"].map((q) => <button key={q} className="rounded-lg border border-border bg-background p-3 text-left text-sm font-medium hover:bg-accent" onClick={() => submit(q)}>{q}</button>)}</div></ConversationEmptyState>}{thread?.messages.map((message) => <Message key={message.id} from={message.role}><MessageContent><MessageResponse>{message.text}</MessageResponse>{message.role==="assistant" && message.sources?.length ? <div className="mt-3 flex flex-wrap gap-2"><span className="text-xs font-semibold text-muted-foreground">Based on your records</span>{message.sources.map((source) => <Link key={source} to="/records" className="rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-xs font-semibold text-primary">{source}</Link>)}</div> : null}</MessageContent></Message>)}{status==="submitted" && <Message from="assistant"><MessageContent><p className="animate-pulse text-sm text-muted-foreground">Reviewing the relevant records…</p></MessageContent></Message>}</ConversationContent><ConversationScrollButton /></Conversation><div className="border-t border-border p-4"><PromptInput onSubmit={(message) => submit(message.text)} className="mx-auto max-w-3xl bg-background"><PromptInputTextarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a report, medicine, symptom or visit…" /><PromptInputFooter className="justify-between"><Button type="button" size="icon" variant="ghost" onClick={startVoice} aria-label="Use microphone"><Mic /></Button><PromptInputSubmit status={status} disabled={!input.trim()} /></PromptInputFooter></PromptInput><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">HealthPilot AI does not diagnose. Seek qualified medical care for urgent concerns.</p></div></section></div>;
}

function MedicationsPage({ state, setState, notify }: { state: HealthState; setState: (updater:(s:HealthState)=>HealthState)=>void; notify:(s:string)=>void }) { const markTaken = (id:string) => { const medication=state.medications.find((m)=>m.id===id); if (medication?.takenAt) { notify("This dose is already marked as taken"); return; } const time=new Date().toLocaleString([], { dateStyle:"medium", timeStyle:"short" }); setState((current)=>({...current,medications:current.medications.map((m)=>m.id===id?{...m,takenAt:time,remaining:Math.max(0,m.remaining-1)}:m)})); notify("Dose recorded in your Health Journey"); }; return <div><SectionHeading eyebrow="Current treatment plan" title="Medications" /><div className="grid gap-4 lg:grid-cols-2">{state.medications.map((m)=><div key={m.id} className="rounded-lg border border-border bg-card p-6 shadow-soft"><div className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-primary"><Pill /></div><div className="min-w-0 flex-1"><h2 className="text-lg font-bold">{m.name}</h2><p className="text-sm text-muted-foreground">{m.dose} · {m.schedule}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-2xl font-bold">{m.remaining}</p><p className="text-xs text-muted-foreground">doses remaining</p></div><Button onClick={()=>markTaken(m.id)} disabled={Boolean(m.takenAt)}>{m.takenAt ? <><Check />Taken {m.takenAt}</> : "Mark as taken"}</Button></div></div></div></div>)}</div></div>; }
function AppointmentsPage({ onAsk }: { onAsk:(q:string)=>void }) { return <div><SectionHeading eyebrow="Next visit" title="Appointment with Dr. Kiran Reddy" /><div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><div className="rounded-lg border border-border bg-card p-6 shadow-soft"><CalendarDays className="size-7 text-primary"/><h2 className="mt-5 text-xl font-bold">Wednesday, 14 October</h2><p className="mt-1 text-muted-foreground">10:30 AM · General Medicine · Hyderabad</p><Button className="mt-6" onClick={()=>onAsk("Prepare me for my upcoming doctor visit")}>Prepare for my visit</Button></div><div className="rounded-lg border border-border bg-card p-6 shadow-soft"><p className="text-xs font-bold uppercase text-primary">Doctor visit brief</p><h3 className="mt-3 text-xl font-semibold">What to cover</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground"><li>• Review haemoglobin and vitamin D changes</li><li>• Confirm duration of both supplements</li><li>• Discuss ongoing tiredness and progress</li><li>• Agree timing for the next blood test</li></ul><Button variant="outline" className="mt-6" onClick={()=>onAsk("Create my 1-minute health summary for my doctor")}>Create my 1-minute summary</Button></div></div></div>; }
function InsightsPage({ onAsk }: { onAsk:(q:string)=>void }) { return <div><SectionHeading eyebrow="Transparent trends" title="Insights with a reason" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><InsightCard title="Two values moved upward" body="Haemoglobin and vitamin D are higher in the latest report." source="Compared Aug 12 and Sep 15 reports"/><InsightCard title="Glucose stayed similar" body="There was a 2 mg/dL difference between the two reports." source="Compared Aug 12 and Sep 15 reports"/><InsightCard title="Medicine review is due" body="Your next visit is scheduled to review progress and supplements." source="Appointment and prescription"/></div><Button className="mt-6" onClick={()=>onAsk("Explain all my latest insights and their sources")}>Ask why I am seeing these insights</Button></div>; }
function ProfilePage() { return <div><SectionHeading eyebrow="FHIR-style health profile" title="Emergency information"/><div className="grid gap-5 md:grid-cols-2"><div className="rounded-lg border border-border bg-card p-6 shadow-soft"><p className="text-xs font-bold uppercase text-primary">ABHA health identity</p><h2 className="mt-3 text-2xl font-bold">Ananya Rao</h2><p className="mt-1 text-muted-foreground">ABHA 91-2387-4456-1209</p><div className="mt-6 grid grid-cols-2 gap-4"><DataPoint label="Blood group" value="B+"/><DataPoint label="Date of birth" value="17 May 1998"/><DataPoint label="Allergies" value="Penicillin"/><DataPoint label="Emergency contact" value="Ravi · +91 •••• 4482"/></div></div><div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6"><p className="text-xs font-bold uppercase text-destructive">Emergency card</p><h3 className="mt-3 font-semibold">Current medications</h3><p className="mt-2 text-sm text-muted-foreground">Ferrous Ascorbate 100 mg daily<br/>Cholecalciferol 60,000 IU weekly</p><h3 className="mt-5 font-semibold">Important allergy</h3><p className="mt-2 text-sm text-muted-foreground">Penicillin — recorded patient allergy</p></div></div></div>; }
function DataPoint({label,value}:{label:string;value:string}){return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>}
function SettingsPage({ state, setState }: { state:HealthState; setState:(updater:(s:HealthState)=>HealthState)=>void }) { return <div><SectionHeading eyebrow="Preferences" title="Settings"/><div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-soft"><h2 className="font-semibold">Language</h2><div className="mt-4 flex gap-2"><Button variant={state.language==="en"?"default":"outline"} onClick={()=>setState(s=>({...s,language:"en"}))}>English</Button><Button variant={state.language==="te"?"default":"outline"} onClick={()=>setState(s=>({...s,language:"te"}))}>తెలుగు</Button></div><div className="mt-8 border-t border-border pt-6"><h2 className="font-semibold">Connected device</h2><p className="mt-2 text-sm text-muted-foreground">{state.deviceConnected?"Apple Health demo connection is active.":"No health device is connected."}</p></div></div></div>; }

function UploadDialog({ open,onOpenChange,onSaved,onCritical }:{open:boolean;onOpenChange:(o:boolean)=>void;onSaved:()=>void;onCritical:()=>void}) { const [step,setStep]=useState(0); const labels=["Reading document…","Finding dates…","Identifying medicines…","Connecting medical information…"]; useEffect(()=>{if(!open){setStep(0);return;} if(step>0&&step<5){const timer=window.setTimeout(()=>setStep(s=>s+1),650);return()=>window.clearTimeout(timer);}},[open,step]); return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Upload medical record</DialogTitle><DialogDescription>Your record stays editable until you review and save it.</DialogDescription></DialogHeader>{step===0&&<div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-primary/40 bg-accent p-8 text-center"><div><CloudUpload className="mx-auto size-10 text-primary"/><p className="mt-4 font-semibold">Drop a prescription, lab report or discharge summary</p><p className="mt-2 text-sm text-muted-foreground">PDF, JPG or PNG · demo extraction</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Button onClick={()=>setStep(1)}>Choose sample report</Button><Button variant="outline" onClick={onCritical}>Try critical sample</Button></div></div></div>}{step>0&&step<5&&<div className="py-10"><div className="mx-auto size-12 animate-spin rounded-full border-4 border-accent border-t-primary"/><p className="mt-5 text-center font-semibold">{labels[Math.min(step-1,3)]}</p><div className="mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{width:`${step*22}%`}}/></div></div>}{step>=5&&<div className="space-y-4"><div className="rounded-lg bg-accent p-4 text-sm"><ShieldCheck className="mr-2 inline size-4 text-primary"/>AI extraction ready for your review</div>{[["Record type","Lab report"],["Date","08 October 2026"],["Patient","Ananya Rao"],["Summary","Routine blood panel; no critical marker detected in this sample."]].map(([label,value])=><label key={label} className="block text-sm font-semibold">{label}<input defaultValue={value} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 font-normal"/></label>)}</div>}<DialogFooter>{step>=5&&<Button onClick={onSaved}>Save to Health Journey</Button>}</DialogFooter></DialogContent></Dialog>; }
function DeviceDialog({open,onOpenChange,onConnect}:{open:boolean;onOpenChange:(o:boolean)=>void;onConnect:()=>void}) { return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Connect health device</DialogTitle><DialogDescription>Import steps, heart rate, sleep, water and activity into your connected journey.</DialogDescription></DialogHeader><div className="space-y-3">{[["Apple Health","iPhone and Apple Watch"],["Google Fit","Android and Wear OS"],["Smartwatch","Bluetooth wearable demo"]].map(([name,desc],i)=><button key={name} onClick={onConnect} className="flex w-full items-center gap-4 rounded-lg border border-border p-4 text-left hover:bg-accent"><div className="grid size-10 place-items-center rounded-lg bg-muted text-primary"><Watch/></div><div className="flex-1"><p className="font-semibold">{name}</p><p className="text-xs text-muted-foreground">{desc}</p></div>{i===0&&<span className="text-xs font-semibold text-primary">Recommended</span>}<ChevronRight className="size-4"/></button>)}</div></DialogContent></Dialog>; }
function AlertDialog({open,onOpenChange}:{open:boolean;onOpenChange:(o:boolean)=>void}) { return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-destructive/30"><DialogHeader><div className="mb-2 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"><AlertTriangle/></div><DialogTitle>Important: Please consult a qualified doctor promptly.</DialogTitle><DialogDescription>This demo record contains a result explicitly marked critical by the source document. HealthPilot is not diagnosing the cause.</DialogDescription></DialogHeader><div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"><p className="text-xs font-bold uppercase text-destructive">Source record</p><p className="mt-2 font-semibold">Critical Sample Lab Report · 08 Oct 2026</p><p className="mt-1 text-sm text-muted-foreground">Glucose: 420 mg/dL · marked “CRITICAL HIGH” in uploaded report</p></div><DialogFooter><Button variant="outline" onClick={()=>onOpenChange(false)}>Close</Button><Button onClick={()=>onOpenChange(false)}>I understand</Button></DialogFooter></DialogContent></Dialog>; }
function EventDialog({event,onOpenChange,onAsk}:{event:JourneyEvent|null;onOpenChange:(o:boolean)=>void;onAsk:(q:string)=>void}) { if(!event)return null; const Icon=eventIcon[event.type]; return <Dialog open={Boolean(event)} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-2xl"><DialogHeader><div className="mb-2 grid size-12 place-items-center rounded-lg bg-accent text-primary"><Icon/></div><DialogTitle>{event.title}</DialogTitle><DialogDescription>{event.date}{event.doctor?` · ${event.doctor}`:""}</DialogDescription></DialogHeader><div className="space-y-5"><div><p className="text-xs font-bold uppercase text-primary">What happened</p><p className="mt-2 text-sm leading-6">{event.detail}</p></div>{event.record&&<div><p className="text-xs font-bold uppercase text-primary">Related record</p><p className="mt-2 rounded-lg bg-muted p-3 text-sm font-semibold">{event.record}</p></div>}<div><p className="text-xs font-bold uppercase text-primary">Important extracted information</p><ul className="mt-2 space-y-2 text-sm">{event.extracted.map(item=><li key={item}>• {item}</li>)}</ul></div><div className="rounded-lg border border-primary/20 bg-accent p-4"><p className="text-xs font-bold uppercase text-primary">AI Connection</p><p className="mt-2 text-sm">{event.connection}</p></div></div><DialogFooter><Button variant="outline" onClick={()=>onAsk(`Explain the ${event.title} from ${event.date}`)}><Bot/>Explain with AI</Button></DialogFooter></DialogContent></Dialog>; }