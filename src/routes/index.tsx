import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, CheckCircle2, Clock } from "lucide-react";
import { AppLayout, ResponsibleAiNotice } from "@/components/workmate/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkMate } from "@/lib/workmate-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "WorkMate AI writes professional emails, summarizes meeting notes and plans your workday in one connected dashboard.",
      },
      { property: "og:title", content: "WorkMate AI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Communicate better. Get more done — with one AI productivity platform.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/smart-email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Create professional workplace emails.",
    cta: "Create Email",
  },
  {
    to: "/meeting-summarizer",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Turn meeting notes into summaries and action items.",
    cta: "Summarize Meeting",
  },
  {
    to: "/task-planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritize and schedule your workload.",
    cta: "Plan My Tasks",
  },
] as const;

function Dashboard() {
  const { stats, activity } = useWorkMate();

  const statCards = [
    { label: "Emails Generated", value: stats.emails, icon: Mail },
    { label: "Meetings Summarized", value: stats.meetings, icon: NotebookPen },
    { label: "Tasks Planned", value: stats.plans, icon: ListChecks },
    { label: "Tasks Completed", value: stats.tasksCompleted, icon: CheckCircle2 },
  ];

  return (
    <AppLayout>
      <section className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome to WorkMate AI 👋
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Work smarter. Communicate better. Get more done.
        </p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, description, cta }) => (
          <Card key={to} className="flex flex-col">
            <CardHeader>
              <span className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <p className="text-sm text-muted-foreground">{description}</p>
              <Button asChild className="w-full">
                <Link to={to}>{cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Productivity statistics
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 pt-6">
                <span className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-2xl font-semibold text-foreground">{value}</span>
                  <span className="block text-xs text-muted-foreground">{label}</span>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date / time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activity.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.title}</TableCell>
                        <TableCell className="text-muted-foreground">{a.description}</TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {new Date(a.at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Clock className="size-4" aria-hidden="true" />
                No activity yet — generate an email, summary or plan to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <ResponsibleAiNotice />
    </AppLayout>
  );
}
