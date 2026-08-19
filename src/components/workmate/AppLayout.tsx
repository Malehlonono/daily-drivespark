import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RESPONSIBLE_AI_NOTICE } from "@/lib/ai/prompts";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart-email", label: "Smart Email", icon: Mail },
  { to: "/meeting-summarizer", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-base font-semibold leading-tight text-sidebar-foreground">WorkMate AI</span>
        <span className="block text-xs text-sidebar-foreground/60">Productivity assistant</span>
      </span>
    </div>
  );
}

export function ResponsibleAiNotice() {
  return (
    <aside className="rounded-xl border border-border bg-muted/60 p-4 text-xs leading-relaxed text-muted-foreground">
      <span className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-foreground">
        <ShieldAlert className="size-4" aria-hidden="true" />
        Responsible AI Notice
      </span>
      {RESPONSIBLE_AI_NOTICE}
    </aside>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </header>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Brand />
        <NavLinks />
        <p className="mt-auto text-[11px] leading-relaxed text-sidebar-foreground/50">
          Work smarter. Communicate better. Get more done.
        </p>
      </aside>

      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-lg border border-border text-foreground"
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 space-y-6 bg-sidebar p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-border"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
