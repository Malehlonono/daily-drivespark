// Prompt engineering layer — kept separate from UI and API/service logic.

export type EmailInput = {
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: string;
  length: string;
  extra: string;
};

export type MeetingInput = {
  title: string;
  date: string;
  attendees: string;
  notes: string;
};

export type PlannerTask = {
  name: string;
  priority: string;
  deadline: string;
  duration: string;
};

export type PlannerInput = {
  tasks: PlannerTask[];
  startTime: string;
  endTime: string;
  instructions: string;
};

export const RESPONSIBLE_AI_NOTICE =
  "AI-generated content may contain errors, omissions, or inaccurate information. Always review and verify AI outputs before using them in professional settings. Do not enter confidential, sensitive, personal, or proprietary information into the application.";

export const AI_REVIEW_LABEL = "AI-generated content — review before use.";

export function emailPrompt(input: EmailInput) {
  return `ROLE
You are a professional workplace communication assistant.

OBJECTIVE
Generate a clear, professional email based on the user's information.

CONTEXT
The user needs to communicate with a workplace recipient about the purpose and key points they provide.

INSTRUCTIONS
- Use the selected tone.
- Follow the requested length.
- Clearly communicate the purpose.
- Organize the information logically.
- Use professional workplace language.
- Maintain appropriate email etiquette.

CONSTRAINTS
- Do not invent facts, names, dates or commitments.
- Do not add information that the user did not provide.
- Do not make unsupported assumptions.
- Use neutral placeholders such as [Your Name] where information is missing.

USER INPUT
Recipient: ${input.recipient || "Not specified"}
Email purpose: ${input.purpose || "Not specified"}
Key points: ${input.keyPoints || "Not specified"}
Tone: ${input.tone}
Length: ${input.length}
Additional instructions: ${input.extra || "None"}

OUTPUT FORMAT
Return JSON only: {"subject": string, "body": string}`;
}

export function meetingPrompt(input: MeetingInput) {
  return `ROLE
You are an AI workplace meeting assistant.

OBJECTIVE
Analyze meeting notes and transform them into a structured, concise and useful meeting summary.

CONTEXT
The user has provided notes from a workplace meeting and needs to identify important information, decisions and follow-up actions.

INSTRUCTIONS
Extract: main discussion points, important decisions, action items, responsible people, deadlines and priorities.

CONSTRAINTS
- Only use information contained in the provided notes.
- Never invent decisions, deadlines, attendees or responsibilities.
- Mark unavailable information as "Not specified".

MEETING
Title: ${input.title || "Not specified"}
Date: ${input.date || "Not specified"}
Attendees: ${input.attendees || "Not specified"}
Notes:
"""
${input.notes}
"""

OUTPUT FORMAT
Return JSON only:
{"executiveSummary": string,
 "keyPoints": string[],
 "decisions": string[],
 "actionItems": [{"task": string, "owner": string, "deadline": string, "priority": string}]}`;
}

export function plannerPrompt(input: PlannerInput) {
  const tasks = input.tasks
    .map(
      (t, i) =>
        `${i + 1}. Task: ${t.name || "Not specified"} | Priority: ${t.priority} | Deadline: ${t.deadline || "Not specified"} | Estimated duration: ${t.duration || "Not specified"}`,
    )
    .join("\n");

  return `ROLE
You are an AI workplace productivity planning assistant.

OBJECTIVE
Create a realistic and prioritized work schedule based on the user's tasks, deadlines, available working hours and preferences.

CONTEXT
The user has a set of workplace tasks that need to be organized into a realistic schedule.

INSTRUCTIONS
Consider priority, deadlines, estimated duration, available working hours and user preferences. Prioritize urgent and important work.

CONSTRAINTS
- Never schedule outside the available working hours.
- Do not invent deadlines or task requirements.
- Do not create an unrealistic schedule.
- If tasks cannot fit into the available time, clearly explain the conflict.
- Identify assumptions where necessary.

USER INPUT
Workday start: ${input.startTime}
Workday end: ${input.endTime}
Additional scheduling instructions: ${input.instructions || "None"}
Tasks:
${tasks}

OUTPUT FORMAT
Return JSON only:
{"prioritizedTasks": [{"name": string, "priority": string, "reason": string}],
 "schedule": [{"time": string, "task": string, "priority": string, "duration": string, "reason": string}],
 "recommendations": string[],
 "conflicts": string}`;
}
