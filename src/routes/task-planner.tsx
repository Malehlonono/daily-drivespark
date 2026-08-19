import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Copy, Eraser, Plus, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/workmate/AppLayout";
import { AiDisclaimer, EmptyState, ErrorState, LoadingState } from "@/components/workmate/AiStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPlan, type PlanResult } from "@/lib/ai.functions";
import { useWorkMate } from "@/lib/workmate-store";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | WorkMate AI" },
      {
        name: "description",
        content:
          "Prioritize your workload and build a realistic daily schedule with AI scheduling recommendations.",
      },
      { property: "og:title", content: "AI Task Planner | WorkMate AI" },
      {
        property: "og:description",
        content: "Prioritize tasks and build a realistic daily work schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

type TaskRow = { id: string; name: string; priority: string; deadline: string; duration: string };

const PRIORITIES = ["High", "Medium", "Low"];

function newRow(partial?: Partial<TaskRow>): TaskRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    priority: "Medium",
    deadline: "",
    duration: "",
    ...partial,
  };
}

function PriorityBadge({ value }: { value: string }) {
  const v = (value || "").toLowerCase();
  return (
    <Badge variant={v === "high" ? "destructive" : v === "low" ? "outline" : "secondary"}>
      {value || "Not specified"}
    </Badge>
  );
}

function PlannerPage() {
  const { logActivity, addCompletedTasks, clearImportedTasks, importedTasks } = useWorkMate();
  const run = useServerFn(createPlan);

  const [tasks, setTasks] = useState<TaskRow[]>([newRow()]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [instructions, setInstructions] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!importedTasks.length) return;
    const imported = importedTasks;
    clearImportedTasks();
    setTasks((prev) => {
      const kept = prev.filter((t) => t.name.trim());
      return [
        ...kept,
        ...imported.map((a) =>
          newRow({
            name: a.task,
            priority: PRIORITIES.includes(a.priority) ? a.priority : "Medium",
            deadline: a.deadline && a.deadline !== "Not specified" ? a.deadline : "",
          }),
        ),
      ];
    });
    toast.success(`${imported.length} action item(s) imported from your meeting`);
  }, [importedTasks, clearImportedTasks]);


  function update(id: string, patch: Partial<TaskRow>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function submit() {
    const filled = tasks.filter((t) => t.name.trim());
    if (!filled.length) {
      toast.error("Add at least one task first.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = (await run({
        data: {
          tasks: filled.map(({ name, priority, deadline, duration }) => ({
            name,
            priority,
            deadline,
            duration,
          })),
          startTime,
          endTime,
          instructions,
        },
      })) as PlanResult;
      setPlan(res);
      setStatus("success");
      logActivity("plan", "Task plan created", `${filled.length} task(s) scheduled`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "");
      setStatus("error");
    }
  }

  function clearAll() {
    setTasks([newRow()]);
    setInstructions("");
    setPlan(null);
    setDone({});
    setStatus("idle");
  }

  function toggleDone(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) addCompletedTasks(1);
      else addCompletedTasks(-1);
      return next;
    });
  }

  async function copyPlan() {
    if (!plan) return;
    const text = [
      `Prioritized Tasks\n${(plan.prioritizedTasks ?? [])
        .map((t, i) => `${i + 1}. ${t.name} (${t.priority}) — ${t.reason}`)
        .join("\n")}`,
      `Today's Productivity Plan\n${(plan.schedule ?? [])
        .map((s) => `${s.time} | ${s.task} | ${s.priority} | ${s.duration} | ${s.reason}`)
        .join("\n")}`,
      `Recommendations\n${(plan.recommendations ?? []).map((r) => `- ${r}`).join("\n")}`,
    ].join("\n\n");
    await navigator.clipboard.writeText(text);
    toast.success("Plan copied to clipboard");
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Task Planner"
        subtitle="Organize, prioritize and schedule your workload into a realistic day."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((t, index) => (
              <div key={t.id} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Task {index + 1}
                  </span>
                  {tasks.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Remove task"
                      onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label>Task name</Label>
                    <Input
                      value={t.name}
                      onChange={(e) => update(t.id, { name: e.target.value })}
                      placeholder="e.g. Draft Q3 report"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={t.priority} onValueChange={(v) => update(t.id, { priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input
                      value={t.deadline}
                      onChange={(e) => update(t.id, { deadline: e.target.value })}
                      placeholder="e.g. Friday 15:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated duration</Label>
                    <Input
                      value={t.duration}
                      onChange={(e) => update(t.id, { duration: e.target.value })}
                      placeholder="e.g. 90 min"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={() => setTasks((prev) => [...prev, newRow()])}>
              <Plus className="size-4" /> Add task
            </Button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start">Workday start time</Label>
                <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Workday end time</Label>
                <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instr">Additional scheduling instructions</Label>
              <Textarea
                id="instr"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Schedule difficult tasks in the morning."
              />
            </div>
            <Button onClick={submit} disabled={status === "loading"}>
              <CalendarClock className="size-4" /> Create My Plan
            </Button>
          </CardContent>
        </Card>

        {status === "idle" ? (
          <EmptyState message="Add your tasks with priority, deadline and estimated duration, then set your working hours to build a plan." />
        ) : null}
        {status === "loading" ? <LoadingState /> : null}
        {status === "error" ? <ErrorState detail={error} onRetry={submit} /> : null}

        {status === "success" && plan ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle>Prioritized Tasks</CardTitle>
                <AiDisclaimer />
              </CardHeader>
              <CardContent className="space-y-3">
                {(plan.prioritizedTasks ?? []).map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {i + 1}. {t.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.reason}</p>
                    </div>
                    <PriorityBadge value={t.priority} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Productivity Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Done</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(plan.schedule ?? []).map((s, i) => {
                        const key = `${i}-${s.task}`;
                        return (
                          <TableRow key={key}>
                            <TableCell>
                              <Button
                                variant={done[key] ? "secondary" : "ghost"}
                                size="sm"
                                aria-label="Mark task complete"
                                onClick={() => toggleDone(key)}
                              >
                                <CheckCircle2 className="size-4" />
                              </Button>
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-medium">{s.time}</TableCell>
                            <TableCell>{s.task}</TableCell>
                            <TableCell>
                              <PriorityBadge value={s.priority} />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{s.duration}</TableCell>
                            <TableCell className="text-muted-foreground">{s.reason}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {plan.conflicts && plan.conflicts !== "Not specified" ? (
                  <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground">
                    {plan.conflicts}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  {(plan.recommendations ?? []).map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copyPlan}>
                    <Copy className="size-4" /> Copy Plan
                  </Button>
                  <Button variant="outline" onClick={submit}>
                    <RefreshCw className="size-4" /> Regenerate
                  </Button>
                  <Button variant="ghost" onClick={clearAll}>
                    <Eraser className="size-4" /> Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <ResponsibleAiNotice />
      </div>
    </AppLayout>
  );
}
