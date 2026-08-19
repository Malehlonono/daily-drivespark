import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/workmate/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkMate } from "@/lib/workmate-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | WorkMate AI" },
      {
        name: "description",
        content: "Set default email tone, response length, responsible AI notices and notifications.",
      },
      { property: "og:title", content: "Settings | WorkMate AI" },
      { property: "og:description", content: "Configure your WorkMate AI workspace preferences." },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["Formal", "Professional", "Friendly", "Persuasive", "Apologetic", "Concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function SettingsPage() {
  const { settings, updateSettings } = useWorkMate();

  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="Tune WorkMate AI to the way you work." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Default email tone</Label>
            <Select value={settings.defaultTone} onValueChange={(v) => updateSettings({ defaultTone: v })}>
              <SelectTrigger className="sm:w-72">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Default response length</Label>
            <Select value={settings.defaultLength} onValueChange={(v) => updateSettings({ defaultLength: v })}>
              <SelectTrigger className="sm:w-72">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsible AI</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Show responsible AI reminders</p>
              <p className="text-xs text-muted-foreground">
                Keeps review-before-use guidance visible across the app.
              </p>
            </div>
            <Switch
              checked={settings.responsibleAi}
              onCheckedChange={(v) => updateSettings({ responsibleAi: v })}
              aria-label="Responsible AI reminders"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">In-app notifications</p>
              <p className="text-xs text-muted-foreground">Toast confirmations when AI actions complete.</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(v) => updateSettings({ notifications: v })}
              aria-label="Notifications"
            />
          </CardContent>
        </Card>

        <ResponsibleAiNotice />
      </div>
    </AppLayout>
  );
}
