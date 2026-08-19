import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAiJson } from "./ai/gateway.server";
import { emailPrompt, meetingPrompt, plannerPrompt } from "./ai/prompts";

const emailSchema = z.object({
  recipient: z.string(),
  purpose: z.string(),
  keyPoints: z.string(),
  tone: z.string(),
  length: z.string(),
  extra: z.string(),
});

const meetingSchema = z.object({
  title: z.string(),
  date: z.string(),
  attendees: z.string(),
  notes: z.string().min(1),
});

const plannerSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string(),
      priority: z.string(),
      deadline: z.string(),
      duration: z.string(),
    }),
  ),
  startTime: z.string(),
  endTime: z.string(),
  instructions: z.string(),
});

export type EmailResult = { subject: string; body: string };
export type ActionItem = { task: string; owner: string; deadline: string; priority: string };
export type MeetingResult = {
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
};
export type PlanResult = {
  prioritizedTasks: Array<{ name: string; priority: string; reason: string }>;
  schedule: Array<{
    time: string;
    task: string;
    priority: string;
    duration: string;
    reason: string;
  }>;
  recommendations: string[];
  conflicts: string;
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => callAiJson<EmailResult>(emailPrompt(data)));

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => meetingSchema.parse(data))
  .handler(async ({ data }) => callAiJson<MeetingResult>(meetingPrompt(data)));

export const createPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => plannerSchema.parse(data))
  .handler(async ({ data }) => callAiJson<PlanResult>(plannerPrompt(data)));
