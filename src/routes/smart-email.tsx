import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, RefreshCw, Eraser, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/workmate/AppLayout";
import { AiDisclaimer, EmptyState, ErrorState, LoadingState } from "@/components/workmate/AiStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail, type EmailResult } from "@/lib/ai.functions";
import { useWorkMate } from "@/lib/workmate-store";

export const Route = createFileRoute("/smart-email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | WorkMate AI" },
      {
        name: "description",
        content:
          "Generate clear, professional workplace emails in seconds with tone and length control.",
      },
      { property: "og:title", content: "Smart Email Generator | WorkMate AI" },
      {
        property: "og:description",
        content: "Generate clear, professional workplace emails with WorkMate AI.",
      },
    ],
  }),
  component: SmartEmailPage,
});

const TONES = ["Formal", "Professional", "Friendly", "Persuasive", "Apologetic", "Concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function SmartEmailPage() {
  const { settings, logActivity } = useWorkMate();
  const run = useServerFn(generateEmail);

  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState(settings.defaultTone);
  const [length, setLength] = useState(settings.defaultLength);
  const [extra, setExtra] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function submit() {
    if (!purpose.trim() && !keyPoints.trim()) {
      toast.error("Add an email purpose or key points first.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const result = (await run({
        data: { recipient, purpose, keyPoints, tone, length, extra },
      })) as EmailResult;
      setSubject(result.subject ?? "");
      setBody(result.body ?? "");
      setStatus("success");
      logActivity("email", "Email generated", purpose.trim() || `Email to ${recipient || "recipient"}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "");
      setStatus("error");
    }
  }

  function clearAll() {
    setRecipient("");
    setPurpose("");
    setKeyPoints("");
    setExtra("");
    setSubject("");
    setBody("");
    setStatus("idle");
  }

  async function copy() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    toast.success("Email copied to clipboard");
  }

  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        subtitle="Create professional workplace emails from a few key points."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Line manager, client, team"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a project deadline extension"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={5}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="List the facts the email must include..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Additional instructions</Label>
              <Textarea
                id="extra"
                rows={3}
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Optional: anything else the AI should respect"
              />
            </div>
            <Button className="w-full" onClick={submit} disabled={status === "loading"}>
              <Wand2 className="size-4" /> Generate Email
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {status === "idle" ? (
            <EmptyState message="Add the recipient, purpose and key points, then generate a draft email you can edit." />
          ) : null}
          {status === "loading" ? <LoadingState /> : null}
          {status === "error" ? <ErrorState detail={error} onRetry={submit} /> : null}
          {status === "success" ? (
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle>Generated Email</CardTitle>
                <AiDisclaimer />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Email body</Label>
                  <Textarea id="body" rows={16} value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copy}>
                    <Copy className="size-4" /> Copy
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
          ) : null}
          <ResponsibleAiNotice />
        </div>
      </div>
    </AppLayout>
  );
}
