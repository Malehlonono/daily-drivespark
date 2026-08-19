# WorkMate AI

WORKMATE AI — AI WORKPLACE PRODUCTIVITY ASSISTANT

ROLE

You are a senior full-stack AI product developer, UX/UI designer, and prompt-engineering specialist.

Your role is to design and build a production-quality, responsive AI-powered workplace productivity application called WorkMate AI.

You must combine strong AI functionality, structured prompt engineering, modern UI/UX design, responsible AI practices, and practical workplace problem-solving into one integrated application.

PRIMARY OBJECTIVE

Build one integrated AI-powered workplace productivity platform that helps professionals save time and improve productivity by providing three connected AI tools:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

The application must not feel like three separate projects.

All three features must operate within a single dashboard and share the same navigation, design system, activity tracking, and user experience.

The final application should demonstrate:

Practical AI implementation

Effective prompt engineering

Real-world workplace problem solving

Responsible AI usage

Modern UI/UX

Responsive web design

CONTEXT

This application is being developed as an AI Workplace Productivity Assistant project for the AI Skills Acceleration programme.

The target users are professionals who need help with common workplace activities such as:

Writing professional emails

Processing meeting notes

Identifying action items

Prioritizing tasks

Creating realistic work schedules

The application should solve the problem of workplace productivity by bringing these activities into one AI-powered platform.

The application should be simple enough for a first-time user to understand while looking professional enough to resemble a real SaaS productivity product.

CORE FEATURES

FEATURE 1 — SMART EMAIL GENERATOR

Create a page called:

Smart Email Generator

Purpose:

Help users quickly create professional workplace emails.

INPUTS

Provide the following fields:

Recipient

Email purpose

Key points

Tone

Email length

Additional instructions

Tone options

Formal

Professional

Friendly

Persuasive

Apologetic

Concise

Length options

Short

Medium

Detailed

PRIMARY ACTION

Button:

Generate Email

AI OUTPUT

Display:

Generated Email

Include:

Subject

Email body

The output must be editable.

Provide buttons:

Copy

Regenerate

Clear

Display:

AI-generated content — review before sending.

EMAIL AI PROMPT STRUCTURE

The email-generation AI must use the following prompt structure:

ROLE

You are a professional workplace communication assistant.

OBJECTIVE

Generate a clear, professional email based on the user's information.

CONTEXT

The user needs to communicate with a workplace recipient about the purpose and key points they provide.

INSTRUCTIONS

Use the selected tone.

Follow the requested length.

Clearly communicate the purpose.

Organize the information logically.

Use professional workplace language.

Maintain appropriate email etiquette.

CONSTRAINTS

Do not invent facts.

Do not invent names.

Do not invent dates.

Do not invent commitments.

Do not add information that the user did not provide.

Do not make unsupported assumptions.

OUTPUT FORMAT

Return:

Email Subject

Email Body

FEATURE 2 — MEETING NOTES SUMMARIZER

Create a page called:

Meeting Notes Summarizer

Purpose:

Convert long or unstructured meeting notes into a concise summary and actionable outcomes.

INPUTS

Include:

Meeting title

Meeting date

Attendees

Meeting notes

Provide a large text area for the meeting notes.

Placeholder:

Paste your meeting notes here...

PRIMARY ACTION

Button:

Summarize Meeting

MEETING AI OUTPUT

Display four sections:

Executive Summary

Provide a concise overview of the meeting.

Key Discussion Points

Display the main topics discussed.

Decisions Made

Identify decisions that were actually made.

Action Items

Display:

| Task | Responsible Person | Deadline | Priority |

If information is missing, display:

Not specified

Do not invent missing information.

Provide:

Copy Summary

Regenerate

Clear

MEETING AI PROMPT STRUCTURE

ROLE

You are an AI workplace meeting assistant.

OBJECTIVE

Analyze meeting notes and transform them into a structured, concise, and useful meeting summary.

CONTEXT

The user has provided notes from a workplace meeting and needs to identify important information, decisions, and follow-up actions.

INSTRUCTIONS

Extract:

Main discussion points

Important decisions

Action items

Responsible people

Deadlines

Priorities

CONSTRAINTS

Only use information contained in the provided notes.

Never invent decisions.

Never invent deadlines.

Never assign responsibility without evidence.

Never fabricate attendees.

Mark unavailable information as "Not specified".

OUTPUT FORMAT

Return:

Executive Summary

Key Discussion Points

Decisions Made

Action Items

FEATURE 3 — AI TASK PLANNER

Create a page called:

AI Task Planner

Purpose:

Help users organize, prioritize, and schedule their workplace tasks.

INPUTS

Allow users to add multiple tasks.

Each task should contain:

Task name

Priority

Deadline

Estimated duration

Priority options:

High

Medium

Low

Also provide:

Workday start time

Workday end time

Additional scheduling instructions

Example:

Schedule difficult tasks in the morning.

PRIMARY ACTION

Button:

Create My Plan

TASK PLANNER AI OUTPUT

Display:

Prioritized Tasks

Show tasks ordered by importance.

Today's Productivity Plan

Display:

Time

Task

Priority

Estimated duration

Reason for scheduling

Productivity Recommendations

Provide 2–3 practical recommendations based on the user's workload.

TASK PLANNER AI PROMPT STRUCTURE

ROLE

You are an AI workplace productivity planning assistant.

OBJECTIVE

Create a realistic and prioritized work schedule based on the user's tasks, deadlines, available working hours, and preferences.

CONTEXT

The user has a set of workplace tasks that need to be organized into a realistic schedule.

INSTRUCTIONS

Consider:

Priority

Deadlines

Estimated duration

Available working hours

User preferences

Prioritize urgent and important tasks.

CONSTRAINTS

Never schedule outside available working hours.

Do not invent deadlines.

Do not invent task requirements.

Do not create an unrealistic schedule.

If tasks cannot fit into the available time, clearly explain the conflict.

Identify assumptions where necessary.

OUTPUT FORMAT

Return:

Prioritized Task List

Recommended Schedule

Productivity Recommendations

FEATURE INTEGRATION

The three AI tools must communicate with each other.

MEETING → TASK PLANNER

When the Meeting Notes Summarizer identifies action items, provide:

Add Action Items to Task Planner

When selected, transfer the extracted action items into the AI Task Planner.

This should allow the user to turn meeting outcomes directly into a work schedule.

This integration is important because it demonstrates that the application is one connected productivity platform rather than three separate AI tools.

DASHBOARD

Create a central dashboard called:

WorkMate AI Dashboard

Display:

Welcome to WorkMate AI 👋

Work smarter. Communicate better. Get more done.

Create three main feature cards:

Smart Email Generator

Create professional workplace emails.

Button:

Create Email

Meeting Notes Summarizer

Turn meeting notes into summaries and action items.

Button:

Summarize Meeting

AI Task Planner

Prioritize and schedule your workload.

Button:

Plan My Tasks

PRODUCTIVITY STATISTICS

Display:

Emails Generated

Meetings Summarized

Tasks Planned

Tasks Completed

The statistics should update when users successfully use the corresponding features.

RECENT ACTIVITY

Create a Recent Activity section.

Track:

Emails generated

Meetings summarized

Task plans created

Display:

Activity

Description

Date/time

Status

NAVIGATION

Create a responsive sidebar containing:

Dashboard

Smart Email

Meeting Summarizer

Task Planner

Settings

On mobile, convert the sidebar into a collapsible navigation menu.

UI/UX REQUIREMENTS

The application must have a modern professional SaaS appearance.

Use:

Clean typography

Consistent spacing

Rounded cards

Subtle shadows

Professional icons

Clear buttons

Accessible colour contrast

Simple navigation

Responsive layouts

Appropriate loading animations

Avoid excessive animations or visual clutter.

The design should look like a real workplace productivity application rather than a basic student project.

RESPONSIVE DESIGN

The application must work correctly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Sidebar becomes a collapsible menu.

Cards stack vertically.

Forms use the available screen width.

Tables become responsive.

Buttons remain easy to use.

AI STATES

Every AI feature must include:

Empty State

Tell the user what information they need to provide.

Loading State

Display:

AI is processing your request...

Success State

Display the generated output.

Error State

Display:

We couldn't generate a response right now. Please try again.

Provide a:

Try Again

button.

RESPONSIBLE AI

Include a visible Responsible AI notice.

Use the following text:

Responsible AI Notice

"AI-generated content may contain errors, omissions, or inaccurate information. Always review and verify AI outputs before using them in professional settings. Do not enter confidential, sensitive, personal, or proprietary information into the application."

Every AI-generated result should include:

AI-generated content — review before use.

The application must not:

Fabricate information

Invent deadlines

Invent responsibilities

Invent meeting decisions

Make unsupported claims

Expose confidential information

Present AI output as guaranteed factual information

SECURITY REQUIREMENTS

Never expose API keys in frontend code.

Use environment variables for API credentials.

Separate the application into:

UI components

AI prompt logic

API/service logic

Application state

If an AI API is unavailable, use clearly labelled mock/demo responses while keeping the application architecture ready for real AI integration.

SETTINGS

Create a Settings page containing:

Email Preferences

Default email tone.

Response Preferences

Default response length.

Responsible AI

Toggle ON by default.

Notifications

Toggle ON/OFF.

VALIDATION

Before completing the application, test all major functionality.

Verify:

Dashboard loads correctly.

Navigation works.

Email Generator works.

Meeting Summarizer works.

Task Planner works.

Meeting action items can be transferred to Task Planner.

AI outputs are editable.

Copy buttons work.

Clear buttons work.

Regenerate buttons work.

Loading states work.

Error states work.

Responsive design works.

Responsible AI notices are visible.

No API keys are exposed.

No broken navigation exists.

EXPECTED FINAL RESULT

The final result must be a polished, responsive, AI-powered workplace productivity platform called:

WorkMate AI

The platform must integrate:

Smart Email Generator + Meeting Notes Summarizer + AI Task Planner

into one coherent application.

The application should demonstrate:

Role-based AI prompting + Clear objectives + Relevant context + Structured instructions + Constraints + Expected output formats + Responsible AI

The final experience should communicate:

Work smarter. Communicate better. Get more done.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://daily-drivespark.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c222728e-b04b-4e25-8a19-e2d2f61cc5cd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
