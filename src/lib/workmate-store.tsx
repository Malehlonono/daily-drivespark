import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ActionItem } from "./ai.functions";

export type ActivityKind = "email" | "meeting" | "plan";

export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  at: string;
  status: string;
};

export type Settings = {
  defaultTone: string;
  defaultLength: string;
  responsibleAi: boolean;
  notifications: boolean;
};

export type Stats = {
  emails: number;
  meetings: number;
  plans: number;
  tasksCompleted: number;
};

type State = {
  stats: Stats;
  activity: ActivityEntry[];
  settings: Settings;
  importedTasks: ActionItem[];
};

const DEFAULT_STATE: State = {
  stats: { emails: 0, meetings: 0, plans: 0, tasksCompleted: 0 },
  activity: [],
  settings: {
    defaultTone: "Professional",
    defaultLength: "Medium",
    responsibleAi: true,
    notifications: true,
  },
  importedTasks: [],
};

const STORAGE_KEY = "workmate-ai-state-v1";

type Ctx = State & {
  logActivity: (kind: ActivityKind, title: string, description: string) => void;
  addCompletedTasks: (count: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  importActionItems: (items: ActionItem[]) => void;
  clearImportedTasks: () => ActionItem[];
};

const WorkMateContext = createContext<Ctx | null>(null);

export function WorkMateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const logActivity = useCallback((kind: ActivityKind, title: string, description: string) => {
    setState((prev) => {
      const stats = { ...prev.stats };
      if (kind === "email") stats.emails += 1;
      if (kind === "meeting") stats.meetings += 1;
      if (kind === "plan") stats.plans += 1;
      const entry: ActivityEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind,
        title,
        description,
        at: new Date().toISOString(),
        status: "Completed",
      };
      return { ...prev, stats, activity: [entry, ...prev.activity].slice(0, 25) };
    });
  }, []);

  const addCompletedTasks = useCallback((count: number) => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, tasksCompleted: prev.stats.tasksCompleted + count },
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const importActionItems = useCallback((items: ActionItem[]) => {
    setState((prev) => ({ ...prev, importedTasks: items }));
  }, []);

  const clearImportedTasks = useCallback(() => {
    setState((prev) => (prev.importedTasks.length ? { ...prev, importedTasks: [] } : prev));
  }, []);


  const value = useMemo(
    () => ({ ...state, logActivity, addCompletedTasks, updateSettings, importActionItems, clearImportedTasks }),
    [state, logActivity, addCompletedTasks, updateSettings, importActionItems, clearImportedTasks],
  );

  return <WorkMateContext.Provider value={value}>{children}</WorkMateContext.Provider>;
}

export function useWorkMate() {
  const ctx = useContext(WorkMateContext);
  if (!ctx) throw new Error("useWorkMate must be used inside WorkMateProvider");
  return ctx;
}
