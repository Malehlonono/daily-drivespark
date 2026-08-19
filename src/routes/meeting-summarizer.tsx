import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, RefreshCw, Eraser, NotebookPen, ArrowRightCircle } from "lucide-react";
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
import { summarizeMeeting, type MeetingResult } from "@/lib/ai.functions";
import { useWorkMate } from "@/lib/workmate-store";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | WorkMate AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, decisions and tracked action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | WorkMate AI" },
      {
        property: "og:description",
        content: "Turn meeting notes into summaries, decisions and action items.",
      },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const { logActivity, importActionItems } = useWorkMate();
  const navigate = useNavigate();
  const run = useServerFn(summarizeMeeting);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);

  async function submit() {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = (await run({ data: { title, date, attendees, notes } })) as MeetingResult;
      setResult(res);
      setStatus("success");
      logActivity("meeting", "Meeting summarized", title.trim() || "Untitled meeting");
    } catch (e) {
      setError(e instanceof Error ? e.message : "");
      setStatus("error");
    }
  }

  function clearAll() {
    setTitle("");
    setDate("");
    setAttendees("");
    setNotes("");
    setResult(null);
    setStatus("idle");
  }

  async function copySummary() {
    if (!result) return;
    const text = [
      `Executive Summary\n${result.executiveSummary}`,
      `Key Discussion Points\n${(result.keyPoints ?? []).map((p) => `- ${p}`).join("\n")}`,
      `Decisions Made\n${(result.decisions ?? []).map((d) => `- ${d}`).join("\n")}`,
      `Action Items\n${(result.actionItems ?? [])
        .map((a) => `- ${a.task} | ${a.owner} | ${a.deadline} | ${a.priority}`)
        .join("\n")}`,
    ].join("\n\n");
    await navigator.clipboard.writeText(text);
    toast.success("Summary copied to clipboard");
  }

  function sendToPlanner() {
    if (!result?.actionItems?.length) return;
    importActionItems(result.actionItems);
    toast.success("Action items sent to the AI Task Planner");
    navigate({ to: "/task-planner" });
  }

  return (
    <AppLayout>
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Convert long or unstructured notes into a concise summary and clear next steps."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Meeting date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Comma separated"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes here..."
              />
            </div>
            <Button onClick={submit} disabled={status === "loading"}>
              <NotebookPen className="size-4" /> Summarize Meeting
            </Button>
          </CardContent>
        </Card>

        {status === "idle" ? (
          <EmptyState message="Paste your meeting notes above. Add a title, date and attendees for a richer summary." />
        ) : null}
        {status === "loading" ? <LoadingState /> : null}
        {status === "error" ? <ErrorState detail={error} onRetry={submit} /> : null}

        {status === "success" && result ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle>Executive Summary</CardTitle>
                <AiDisclaimer />
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {result.executiveSummary || "Not specified"}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key Discussion Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground">
                    {(result.keyPoints?.length ? result.keyPoints : ["Not specified"]).map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Decisions Made</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground">
                    {(result.decisions?.length ? result.decisions : ["Not specified"]).map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                <CardTitle>Action Items</CardTitle>
                <Button size="sm" onClick={sendToPlanner} disabled={!result.actionItems?.length}>
                  <ArrowRightCircle className="size-4" /> Add Action Items to Task Planner
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Responsible Person</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(result.actionItems ?? []).length ? (
                        result.actionItems.map((a, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{a.task || "Not specified"}</TableCell>
                            <TableCell>{a.owner || "Not specified"}</TableCell>
                            <TableCell>{a.deadline || "Not specified"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{a.priority || "Not specified"}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Not specified
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copySummary}>
                    <Copy className="size-4" /> Copy Summary
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
