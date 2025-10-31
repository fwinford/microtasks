# Micro-Deadlines (AI Assisted)

A tiny planner for students. Create an assignment with a due date (+ optional course). Optionally ask AI to suggest micro-tasks, edit them, then track completion.

## Must-Have Outcome (Final)
Create assignment → request AI breakdown (edit before saving) → see next-7-days → mark tasks done.

## User Stories
- As a student, I can create an assignment with title + due date (+ course).
- As a student, I can get an AI-suggested breakdown into tasks and edit it.
- As a student, I can mark tasks done and view what’s due in the next 7 days.

## Data Model (draft)
**Course**: `name`, `code?`  
**Assignment**: `title` (req), `dueDate` (req), `courseId?`, `notes?`  
**Task**: `assignmentId` (req), `title` (req), `status ('todo'|'done')`, `etaMins?`, `plannedDate?`  
Indexes: `Assignment.dueDate`, `Task.assignmentId`  
Sample docs: `documentation/sample-data.md`

## Research Topics (≥10 pts)
External AI API (5) + ESLint w/ build tool (2) + Tailwind (2) + Vitest unit tests (3) = **12 pts**.

## Wireframes & Sitemap (placeholders)
- `documentation/wireframes/home.png`
- `documentation/wireframes/assignment-detail.png`
- `documentation/wireframes/create-assignment.png`  
Sitemap: `/`, `/assignments`, `/assignments/:id`, `/tasks`

## Dev Setup
- `.env`  
MONGO_URL=mongodb://127.0.0.1:27017/microdeadlines
PORT=3000

- Run: `npm run dev`

## Milestones
- **M1** (this): README + sample data + draft schemas + skeleton + wireframe placeholders.  
- **M2**: deploy + working Create Assignment form.  
- **M3**: AI suggest flow + toggle done (2 forms total).
