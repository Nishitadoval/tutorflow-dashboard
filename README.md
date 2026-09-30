# TutorFlow Dashboard

The human-facing companion to [tutorflow-mcp](../tutorflow-mcp) — an Angular
21 dashboard for the same tutoring data an AI agent manages through MCP.
Same database, same underlying services on the backend; this is just the
other way in.

## Design

Styled around what the app actually is — a tutor's notebook — rather than
a generic SaaS dashboard:

- **Layout:** left rail is a student roster (the index), right pane is the
  selected student's "page," tabbed into Sessions / Homework / Progress
  reports.
- **Color:** cool paper background, warm near-black ink, a muted red-pen
  accent used only for things that need attention (overdue homework), a
  moss green for saved/confirmed states.
- **Type:** Source Serif 4 for headings, Inter for body/UI — two distinct
  families, textbook feel without being twee.
- **The one non-decorative detail:** a small dog-eared corner mark on a
  roster row only appears when that student has real overdue homework
  (backed by an `overdue_homework_count` the API computes with a single
  grouped SQL query) — not a static badge.

## Setup

Requires the [tutorflow-mcp](../tutorflow-mcp) REST API running first
(`npm run dev:api` there, on port 3001 by default).

```bash
npm install
npm start   # http://localhost:4200
```

To point at a deployed backend instead of localhost, change `API_BASE_URL`
in `src/app/core/api-config.ts`.

## Architecture

```
src/app/
  core/
    api-config.ts               - backend base URL, one place to change it
    models/tutorflow.models.ts  - types matching the REST API's JSON shapes
    services/tutorflow-api.service.ts - the only file that knows endpoint URLs
  features/
    roster/            - left rail: searchable student list, overdue indicator
    workspace/          - right pane container: fetches StudentDetail, owns tabs
    sessions/            - session log: form + list
    homework/            - homework tracker: form + checklist + delete
    progress-reports/    - draft/save flow for the LLM-generated reports
```

`workspace.ts` is the one "smart" container - it fetches the combined
student detail (sessions + homework + reports in one call, matching the
REST API's `GET /api/students/:id` shape) and refetches after any write.
The tab components below it are mostly presentational, taking data as
inputs and emitting events upward - except `progress-report-viewer.ts`,
which talks to the API directly for its own draft/save flow since that
flow doesn't affect the rest of the student's data.

## Deploying to Vercel

1. Push this folder to its own GitHub repo (or a subfolder of a monorepo —
   just point Vercel's "Root Directory" setting at it if so).
2. In Vercel, "Add New Project" → import that repo. `vercel.json` in this
   folder already sets the build command and output directory
   (`dist/tutorflow-dashboard/browser`) — Vercel should pick it up
   automatically.
3. Before your first deploy, open `src/app/core/api-config.ts` and confirm
   `DEPLOYED_API_BASE_URL` matches your actual deployed Render URL — it's
   currently a placeholder.
4. Deploy. `API_BASE_URL` switches automatically based on hostname (see
   that file's comment), so the same build works both locally and deployed
   with no separate environment-file setup.
5. **Important last step:** once you have your Vercel URL, go back to your
   Render deployment (tutorflow-mcp) and set the `DASHBOARD_ORIGIN`
   environment variable to that exact URL, then redeploy. Without this,
   the backend accepts requests from any origin — see the access-control
   note in `src/api/server.ts` for why that matters once this is public.

## A correctness detail worth knowing

Saving a progress report sends the *exact* drafted text back to the
server (`saveProgressReport(studentId, summary)`) rather than asking the
server to save "whatever the LLM generates now." An LLM call isn't
deterministic - if the save button triggered a fresh generation instead of
persisting the reviewed draft, what you approved on screen and what
actually got stored could quietly differ. The API's
`POST /students/:id/progress-report` endpoint only ever saves the text
it's given; drafting and saving are two separate calls
(`/progress-report/draft` and `/progress-report`) for exactly this reason.

## Known limitation

No routing yet - this is a single-page shell with client-side tab state,
not deep-linkable URLs per student. Fine for a single-tutor tool used in
one browser tab; would be a first thing to add if this ever needed
shareable links to a specific student's page.

## Testing

The default `ng new` test setup (Vitest) was removed from this scaffold -
its dependency tree triggered an unrelated npm resolution bug in the build
environment this was developed in. Re-add with `ng generate` or your
preferred runner if you want unit tests; nothing here depends on its
absence.
