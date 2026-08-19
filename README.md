# WorkMate AI

A production-ready, AI-powered workplace productivity suite built with [TanStack Start](https://tanstack.com/start), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com).

WorkMate AI brings three essential workplace tools into one unified dashboard:

- **Smart Email Generator** — craft professional emails with selectable tone, length, and purpose.
- **Meeting Notes Summarizer** — extract executive summaries, key points, decisions, and action items from raw meeting notes.
- **AI Task Planner** — build realistic, prioritized daily schedules from your task list and working hours.

## Features

- **Unified Dashboard** — central navigation, productivity statistics, and recent activity feed.
- **Seamless handoff** — send action items from the Meeting Summarizer directly to the Task Planner.
- **Responsible AI notices** — every AI output is clearly labeled and reviewed before use.
- **Responsive design** — works on desktop, tablet, and mobile with a collapsible sidebar and mobile menu.
- **Local persistence** — settings, activity history, and productivity stats are stored in the browser's `localStorage`.
- **Server-side AI calls** — prompts and API keys stay on the server; the browser never sees the gateway key.

## Tech Stack

- **Framework:** TanStack Start v1
- **Runtime:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **AI:** Lovable AI Gateway (`google/gemini-2.5-flash`)
- **State:** React Context + `localStorage`
- **Validation:** Zod

## Project Structure

```
src/
├── components/workmate/    # Reusable UI components (AppLayout, AiStates, notices)
├── lib/
│   ├── ai/                 # Prompt engineering + server-side AI gateway
│   ├── ai.functions.ts     # createServerFn wrappers for each AI feature
│   ├── workmate-store.tsx  # Global state, activity log, and settings
│   └── utils.ts            # Utility helpers
├── routes/                 # TanStack Start file-based routes
│   ├── index.tsx           # Dashboard
│   ├── smart-email.tsx     # Smart Email Generator
│   ├── meeting-summarizer.tsx
│   ├── task-planner.tsx
│   └── settings.tsx
├── styles.css              # Design tokens and global theme
└── __root.tsx              # Root layout and providers
```

## AI Features

### Smart Email Generator
- Recipient, purpose, and key-point inputs
- Tone and length controls
- Generated subject and body, ready to copy or edit

### Meeting Notes Summarizer
- Extracts an executive summary, key points, and decisions
- Formats action items with owner, deadline, and priority
- One-click transfer of action items to the Task Planner

### AI Task Planner
- Add multiple tasks with priority, deadline, and estimated duration
- Define working hours and scheduling preferences
- Receives a prioritized schedule with recommendations and conflict detection

## Responsible AI

All AI-generated content is clearly labeled and includes a reminder to review before use. The app never fabricates facts or sensitive information, and it prompts users to verify outputs before sending or acting on them.

## Development

### Prerequisites

- Node.js 18+
- `npm`, `yarn`, `pnpm`, or `bun`

### Install dependencies

```bash
bun install
```

### Run the dev server

```bash
bun run dev
```

The app will be available at `http://localhost:8080`.

### Build for production

```bash
bun run build
```

## Environment Variables

The app uses the Lovable AI Gateway for server-side AI calls. No browser-facing API keys are required.

- `LOVABLE_API_KEY` — injected by Lovable Cloud; used in server functions to call the AI Gateway.

> Do not expose `LOVABLE_API_KEY` in client-side code. All AI calls are routed through `createServerFn` handlers.

## License

Copyright (c) 2026 WorkMate AI. All rights reserved.

---

Built with [Lovable](https://lovable.dev).
