# Micro-Deadlines (AI Assisted)

A web-based planner for students featuring AI-powered task breakdown. Create assignments with due dates, get intelligent micro-task suggestions from AI, and track completion with an interactive todo-list interface.

Deployed at: https://microtasks-s49i.onrender.com

## Features (Implemented)
- Create assignments with title, due date, course, and notes
- AI-powered task breakdown using OpenAI GPT-3.5-turbo
- 24-hour AI response caching to reduce API calls
- Interactive todo-list with strikethrough completion
- Real-time remaining time calculation
- Filter assignments by course
- Delete assignments (cascades to tasks)
- View assignments due in next 7 days
- MongoDB Atlas cloud database integration
- Responsive modern UI with smooth animations

## Must-Have Outcome (Completed)
Create assignment → request AI breakdown → edit/save tasks → mark tasks done → see next-7-days view

## User Stories (All Complete)
- As a student, I can create an assignment with title + due date + course + notes
- As a student, I can get an AI-suggested breakdown into tasks with time estimates
- As a student, I can mark tasks done with strikethrough and see remaining time
- As a student, I can view what's due in the next 7 days
- As a student, I can filter assignments by course
- As a student, I can delete assignments I no longer needdlines (AI Assisted)

A tiny planner for students. Create an assignment with a due date (+ optional course). Optionally ask AI to suggest micro-tasks, edit them, then track completion.

## Must-Have Outcome (Final)
Create assignment → request AI breakdown (edit before saving) → see next-7-days → mark tasks done.

## User Stories
- As a student, I can create an assignment with title + due date (+ course).
- As a student, I can get an AI-suggested breakdown into tasks and edit it.
- As a student, I can mark tasks done and view what’s due in the next 7 days.

## Data Model (draft)
**Assignment**: `title` (req), `dueDate` (req), `courseId?` (string), `notes?`, `aiBreakdown?` (cached AI response), `aiBreakdownGeneratedAt?` (cache timestamp)  
**Task**: `assignmentId` (req), `title` (req), `status ('todo'|'done')`, `etaMins?`, `plannedDate?`  
**Course**: `name`, `code?` (NOT CURRENTLY USED - assignments store course as simple string)

Indexes: `Assignment.dueDate`, `Task.assignmentId`  
Sample docs: `documentation/sample-data.md`

## Tech Stack
**Backend:**
- Node.js + Express.js - RESTful API server
- MongoDB Atlas - Cloud database
- Mongoose - ODM for MongoDB
- OpenAI API - GPT-3.5-turbo for task breakdown suggestions
- dotenv - Environment configuration
- Morgan - HTTP request logging

**Frontend:**
- Vanilla JavaScript (ES6+) - No framework needed
- HTML5 + CSS3 - Responsive design
- Fetch API - Async HTTP requests

## API Endpoints
- `GET /assignments` - List all assignments (or ?next7=1 for next 7 days)
- `POST /assignments` - Create new assignment
- `DELETE /assignments/:id` - Delete assignment and cascade to tasks
- `POST /assignments/:id/breakdown/suggest` - Get AI task breakdown (cached 24hrs)
- `POST /assignments/:id/breakdown/apply` - Save suggested tasks to database
- `GET /tasks` - List all tasks (or ?day=YYYY-MM-DD for specific day)
- `POST /tasks` - Create individual task
- `PATCH /tasks/:id/toggle` - Toggle task completion status

## Research Topics (12 pts COMPLETED)
**External AI API (5 pts)** - IMPLEMENTED
- OpenAI GPT-3.5-turbo integration for task breakdown suggestions
- Intelligent caching strategy (24-hour cache) to minimize API calls
- Fallback handling for API errors
- Code: `routes/assignments.js` lines 41-173

**Additional Research Topics (Planned)**
- ESLint w/ build tool (2 pts) - Not yet implemented  
- Tailwind CSS (2 pts) - Not yet implemented
- Vitest unit tests (3 pts) - Not yet implemented

**Current Total: 5 pts (Minimum 5 required - COMPLETE)**

## Wireframes & Sitemap (placeholders)
- `documentation/wireframes/home.png`
- `documentation/wireframes/assignment-detail.png`
- `documentation/wireframes/create-assignment.png`  
Sitemap: `/`, `/assignments`, `/assignments/:id`, `/tasks`

## Dev Setup
```bash
# Install dependencies
npm install

# Create .env file with:
MONGO_URL=mongodb+srv://your-atlas-connection-string
PORT=3000
OPENAI_API_KEY=your-openai-api-key

# Run development server (with auto-reload)
npm run dev

# Run production server
npm start
```

## Environment Variables
- `MONGO_URL` or `DSN` or `MONGODB_URI` - MongoDB connection string (defaults to local)
- `PORT` - Server port (defaults to 3000)
- `OPENAI_API_KEY` - OpenAI API key for AI task breakdown feature

## Milestones
- **M1**: README + sample data + draft schemas + skeleton + wireframe placeholders - COMPLETE
- **M2**: Deploy + working Create Assignment form + AI integration - COMPLETE
- **M3**: AI suggest flow + toggle done + delete functionality - COMPLETE

## Project Structure
```
microtasks/
├── app.mjs                 # Main Express server
├── package.json            # Dependencies and scripts
├── .env                    # Environment configuration (not in git)
├── models/
│   ├── Assignment.js       # Assignment schema with AI caching
│   ├── Task.js            # Task schema
│   └── Course.js          # Unused (kept for future use)
├── routes/
│   ├── assignments.js     # Assignment CRUD + AI endpoints
│   └── tasks.js           # Task CRUD endpoints
├── public/
│   └── index.html         # Single-page frontend app
└── documentation/
    ├── sample-data.md
    └── wireframes/
        ├── home.png
        ├── assignment-detail.png
        └── create-assignment.png
```

## Code Audit Summary

**Files to Consider Removing:**
- `config.mjs` - Unused duplicate of dotenv configuration (already in app.mjs)

**Unused Models:**
- `models/Course.js` - Defined but not currently used (marked with comment for future use)

**All Routes Working:**
- All assignment routes functional and tested
- All task routes functional and tested
- Delete cascades working properly
- AI caching working correctly

**No Dead Code Found in:**
- app.mjs - All imports and middleware used
- routes/assignments.js - All routes active
- routes/tasks.js - All routes active  
- public/index.html - Cleaned up unused functions

---

Milestone 02
===

Repository Link
---
https://github.com/fwinford/microtasks

Special Instructions for Using Form
---
No authentication required. Simply navigate to the application and start creating assignments.

1. Fill out the "Create New Assignment" form at the top
2. Click "Add Assignment" to save
3. Click "Get AI Task Breakdown" button on any assignment to generate micro-tasks
4. Click the checkmark button on tasks to mark them complete (strikethrough)
5. Click "Save Tasks to Database" to persist AI-generated tasks
6. Use the course filter dropdown to filter by course
7. Click "Delete Assignment" to remove an assignment and all its tasks

URL for Working Form
---
http://localhost:3000 (or deployed URL if available)

**Form Features:**
- Create Assignment form with title, due date, course ID, and notes
- Real-time validation and feedback
- AJAX submission without page reload
- Success/error messages

URL for Form Results
---
Same page - http://localhost:3000

**Results Display:**
- All assignments shown immediately after creation
- Sorted by due date
- Shows: title, due date, course, notes
- Interactive AI breakdown section
- Course filtering dropdown
- Delete functionality
- "Next 7 Days" filter button

GitHub Code References for Research Topics
---
**External AI API Integration (5 pts) - IMPLEMENTED**
- OpenAI Integration: https://github.com/fwinford/microtasks/blob/main/routes/assignments.js#L41-L173
- AI Caching Logic: https://github.com/fwinford/microtasks/blob/main/models/Assignment.js#L9-L10
- Frontend AI Integration: https://github.com/fwinford/microtasks/blob/main/public/index.html#L241-L300

Key Implementation Details:
- GPT-3.5-turbo model for task breakdown suggestions
- 24-hour response caching in MongoDB to reduce API costs
- Intelligent fallback handling for API errors
- Context-aware prompts including assignment details and due date

Documentation References
---
**External Libraries and APIs:**
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- OpenAI API: https://platform.openai.com/docs/api-reference
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Morgan HTTP Logger: https://github.com/expressjs/morgan
- dotenv: https://github.com/motdotla/dotenv

**Technical References:**
- RESTful API design: https://restfulapi.net/
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Mongoose Schemas: https://mongoosejs.com/docs/guide.html
- OpenAI Chat Completions: https://platform.openai.com/docs/guides/chat
- Express Routing: https://expressjs.com/en/guide/routing.html