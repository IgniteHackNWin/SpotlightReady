This is written so that:

You(Yuvraj)

Riya

Any coding agent (Claude, Copilot, etc.)

Future contributors

…can understand the full product vision immediately.

🚀 Project Ideation Document
SpotlightReady – AI Performance Simulation Engine
1️⃣ Project Overview
Project Name (Working)
SpotlightReady

One-Line Description
An AI-powered immersive performance simulation platform that enables users to rehearse high-stakes real-world scenarios (interviews, speeches, pitches) with real-time audiovisual analytics and structured post-session performance intelligence.

Core Positioning
Not:

A chatbot

A grammar checker

A resume analyzer

But:

A Real-Time Performance Simulation + Analytics Engine

2️⃣ Core Vision
People prepare for:

Job interviews

Public speeches

Client pitches

Viva exams

Presentations

But they currently:

Practice alone

Use static tools

Receive no structured feedback

Cannot measure improvement objectively

SimuSpeak solves this by:

Simulating realistic environments

Analyzing live audiovisual signals

Generating structured performance scores

Providing replay + actionable improvement plans

3️⃣ Core Modules (System Architecture)
System is divided into 4 Layers:

🔹 Layer 1: Simulation Engine (Frontend UX Layer)
Responsible for immersive experience.

Supported Modes (MVP)
Interview Mode

Speech Mode

Future Modes (Optional)
Client Pitch Mode

Debate Mode

Viva Mode

Casual Mode (fun demo)

🔹 Layer 2: Real-Time Performance Engine
Handles:

Webcam input

Microphone input

Live metrics calculation

Minimal UI feedback

Runs mostly client-side for responsiveness.

🔹 Layer 3: AI Evaluation Layer (Mastra Integration)
Handles:

Question generation

Evaluation rubric creation

Transcript analysis

Content scoring

Improvement suggestion generation

🔹 Layer 4: Automation & Reporting Layer (n8n Integration)
Handles:

Report storage

PDF generation

Email reports

Session history

Scheduled reminders

Performance tracking

4️⃣ User Flow (Complete)
🟢 PRE-SESSION FLOW
Step 1 – Select Mode
Interview

Speech

Step 2 – Configure Context
Interview Mode:
Role (e.g., SDE – Java)

Experience level

Company type

Difficulty

Time limit

Speech Mode:
Topic

Audience size

Duration

Formal / Informal

Teleprompter toggle

Step 3 – Preparation Screen
Camera preview

Mic check

3-second countdown

Focus mode toggle

🟢 LIVE SESSION FLOW
Minimal live metrics only.

Live Elements (Common Across Domains)
Timer

Pace indicator (color-based)

Filler word counter

Repetition flag + alternative suggestions

Eye contact indicator

Confidence bar (composite metric)

NO:

Full grammar correction

Detailed scoring

Complex charts

🔵 POST-SESSION FLOW
Step 1 – Processing Screen
AI analyzing performance

Step 2 – Score Reveal
5️⃣ Detailed Metrics Breakdown
🟢 LIVE METRICS (Minimal & Immediate)
Common to Interview & Speech:

1️⃣ Timer
Countdown + progress bar

2️⃣ Pace Indicator
Color-coded:

🔴 Too Fast

🟢 Ideal

🔵 Too Slow

3️⃣ Filler Word Counter
Tracks:

um

uh

like

basically

actually

etc.

4️⃣ Repetition Detector
If repeated > threshold:
Shows:

Word repeated

Suggested alternatives

Example:
“basically (4x)”
→ “specifically”
→ “in essence”

5️⃣ Eye Contact Indicator
% or binary indicator:

Maintaining

Looking away

6️⃣ Confidence Bar (Composite)
Based on:

Voice stability

Eye stability

Hesitation frequency

Pace smoothness

🔵 POST-SESSION REPORT STRUCTURE
SECTION 1: Overall Summary
Overall Score (0–100)

Performance Tier:

Beginner

Developing

Competent

Confident

Executive

Top 3 Strengths

Top 3 Improvements

SECTION 2: Speech Analytics
Words per minute

Total filler words

Repeated words list

Long pause detection

Rhythm consistency

Stutter detection

Includes timestamp markers.

SECTION 3: Visual Presence
Average eye contact %

Eye contact dips (timeline)

Head movement stability

Expressiveness variation

Posture stability (if implemented)

SECTION 4: Content Intelligence (Mastra-powered)
Interview Mode:
Relevance score

Key concept coverage

Missed technical points

Structure evaluation

Depth analysis

Speech Mode:
Message clarity

Narrative structure

Opening strength

Conclusion impact

Emotional energy trend

SECTION 5: Grammar & Language
Top grammar errors

Corrected sentences

Vocabulary upgrade suggestions

Weak transition detection

SECTION 6: Replay System
Full recorded session.

With timeline markers:

Filler spikes

Confidence dips

Eye contact drop

Weak answer sections

SECTION 7: Improvement Plan
3 actionable drills

Retry recommendation

Estimated score improvement

Personalized suggestions

6️⃣ Scoring Model (Weighted)
Total Score: 100

Speech Delivery – 30%
Pace control

Filler management

Pause quality

Visual Presence – 20%
Eye contact

Stability

Expressiveness

Content Quality – 30%
Relevance

Key coverage

Structure

Confidence & Flow – 20%
Voice stability

Hesitation

Engagement

7️⃣ Technology Stack
Frontend
Next.js

Tailwind CSS

WebRTC

Web Speech API

MediaPipe (face tracking)

TensorFlow.js (optional)

Backend
Node.js API

MongoDB

Mastra SDK

Mastra Usage
Agents:

Question Generator

Rubric Creator

Transcript Evaluator

Feedback Generator

n8n Usage
Workflow:

Receive session JSON

Store in MongoDB

Generate PDF report

Email to user

Trigger reminder after X days

Update progress history

8️⃣ MVP Definition (Strict Scope)
Must Have:

Interview Mode

Speech Mode

Live 6 metrics

Post-session scoring

Transcript capture

AI evaluation

Replay

n8n storage workflow

No extras beyond this initially.

9️⃣ Bonus Features (If Time)
Retry with guidance

Teleprompter mode

Performance history graph

Shareable score link

Leaderboard (optional)

Difficulty scaling

AI follow-up question mode

Emotional tone detection

“Stress mode” (rapid-fire interview)

🔟 UX Philosophy
Live:
Minimal.
Non-distracting.
Assistive.

Post:
Deep.
Structured.
Educational.

1️⃣1️⃣ Competitive Advantage
Not replaceable by ChatGPT because:

Uses live camera + audio

Structured deterministic scoring

Real-time composite confidence

Replay with markers

Persistent tracking

Automation workflows

Scenario-based immersion

1️⃣2️⃣ Demo Strategy (Hackathon)
Start in Interview Mode

Answer live question

Show live metrics reacting

End session

Reveal structured score

Open replay with markers

Show improvement plan

Trigger n8n email report

Optional:
Quick 10-second Speech Mode demo.

1️⃣3️⃣ Folder Structure Suggestion
/simuspeak
 ├── /docs
 │     ├── PROJECT_IDEATION.md
 │
 ├── /frontend
 ├── /backend
 ├── /mastra-agents
 ├── /n8n-workflows
 ├── /components
 ├── /utils
 ├── /analysis-engine
 └── README.md
1️⃣4️⃣ Final Product Identity
SimuSpeak is:

A performance rehearsal engine

A structured analytics platform

A skill augmentation tool

A simulation-based training system

Not just:
“AI interview coach.”

This is now your official ideation blueprint.

If you want next, I can create:

A technical implementation roadmap (22-day plan)

Task distribution for 2–3 team members

Or a final polished pitch script for judges

You now have a serious, structured project.





Today 1:42 PM

Riya Sood1:42 PM
can you give a prompt of our idea for copilot like all details what we are thinking work flow 




ChatGPT1:42 PM
Perfect 👍
I’ll give you a clean, structured, copy‑paste master prompt that you can use directly in Copilot / Claude / any coding agent to understand the full system vision, workflow, and architecture.

You can paste this at the top of your project or in Copilot Chat.

🔥 MASTER PROMPT FOR COPILOT
(SimuSpeak – AI Performance Simulation Engine)

You are helping build a project called "SimuSpeak".

PROJECT OVERVIEW:
SimuSpeak is an AI-powered immersive performance simulation platform that helps users rehearse high-stakes real-world scenarios (job interviews, public speeches, pitches) using real-time audio-video analysis and structured post-session performance analytics.

This is NOT a chatbot.
This is NOT just a grammar checker.
This is NOT a resume analyzer.

It is a real-time performance simulation + analytics engine.

CORE GOAL:
Allow users to practice scenarios in a simulated environment while:
- Receiving minimal live feedback (non-distracting)
- Getting deep structured analysis after the session
- Viewing replay with performance markers
- Receiving AI-powered improvement suggestions

---

========================
SYSTEM ARCHITECTURE
========================

The system has 4 main layers:

1) Simulation Layer (Frontend UX)
2) Real-Time Performance Engine
3) AI Evaluation Layer (Mastra integration)
4) Automation & Reporting Layer (n8n integration)

---

========================
USER FLOW
========================

PRE-SESSION FLOW:

Step 1: User selects mode
- Interview Mode
- Speech Mode

Step 2: User configures context

Interview Mode:
- Role (e.g., SDE Java)
- Experience level
- Difficulty
- Company type
- Time limit

Speech Mode:
- Topic
- Audience size
- Duration
- Formal/Informal
- Teleprompter toggle

Step 3: Preparation screen
- Camera preview
- Mic check
- Countdown before start
- Focus mode toggle

---

========================
LIVE SESSION DESIGN
========================

Live feedback must be minimal and non-distracting.

ONLY show the following live metrics:

1) Timer (countdown)
2) Pace indicator (color-based: Too Fast / Ideal / Too Slow)
3) Filler word counter (um, uh, like, basically, etc.)
4) Repetition detector + suggested alternatives (subtle side panel)
5) Eye contact indicator (percentage or simple status)
6) Confidence bar (composite score based on stability, hesitation, pace)

DO NOT show:
- Full grammar corrections live
- Detailed content scoring
- Complex charts
- Overwhelming analytics

Live feedback should improve awareness without breaking flow.

---

========================
POST-SESSION ANALYSIS
========================

After session ends, generate structured report:

SECTION 1: Overall Summary
- Overall Score (0-100)
- Performance tier (Beginner → Executive)
- Top 3 strengths
- Top 3 improvement areas

SECTION 2: Speech Analytics
- Words per minute
- Filler word count + timestamps
- Repeated words list
- Long pause detection
- Rhythm consistency
- Stutter detection

SECTION 3: Visual Presence
- Average eye contact %
- Eye contact dips (timeline)
- Head movement stability
- Expressiveness variation

SECTION 4: Content Intelligence (AI Powered)

Interview Mode:
- Relevance score
- Key concept coverage
- Missed important points
- Structural coherence
- Depth of explanation

Speech Mode:
- Message clarity
- Narrative structure
- Opening strength
- Conclusion impact

SECTION 5: Grammar & Language
- Top grammar errors
- Corrected sentences
- Vocabulary improvement suggestions
- Weak transition detection

SECTION 6: Replay System
- Recorded session playback
- Timeline markers for:
  - Filler spikes
  - Confidence dips
  - Eye contact drops
  - Weak explanation moments

SECTION 7: Improvement Plan
- 3 specific drills
- Retry recommendation
- Estimated potential improvement

---

========================
SCORING MODEL
========================

Total Score = 100

Speech Delivery (30%)
- Pace control
- Filler management
- Pause quality

Visual Presence (20%)
- Eye contact
- Stability
- Expressiveness

Content Quality (30%)
- Relevance
- Key concept coverage
- Structure

Confidence & Flow (20%)
- Voice stability
- Hesitation patterns
- Engagement

---

========================
TECH STACK
========================

Frontend:
- Next.js
- WebRTC (camera + mic)
- Web Speech API (speech-to-text)
- MediaPipe (face + eye tracking)
- Tailwind CSS

Backend:
- Node.js API routes
- MongoDB for session storage

AI Layer (Mastra):
Use Mastra agents for:
- Question generation
- Evaluation rubric generation
- Transcript analysis
- Feedback generation

Automation Layer (n8n):
Workflow:
- Receive session report JSON
- Store in database
- Generate PDF report
- Email user
- Update progress history
- Schedule improvement reminder

---

========================
DESIGN PHILOSOPHY
========================

Live = Awareness.
Post-session = Intelligence.

System should feel:
- Professional
- Immersive
- Clean
- Not cluttered
- Performance-oriented

It should NOT feel like:
- A grammar tool
- A chatbot
- A student project

---

========================
IMPLEMENTATION PRIORITY (MVP)
========================

Must have:
- Interview mode
- Speech mode
- Live 6 metrics
- Transcript capture
- Post-session structured scoring
- Replay system
- Basic Mastra AI evaluation
- n8n workflow storing report

No extra features until MVP is stable.

---

When generating code:
- Keep components modular.
- Separate live metrics logic from post-analysis logic.
- Design scoring engine as independent utility module.
- Store session data in structured JSON format.
- Keep UI minimal and professional.

You are building a performance simulation engine, not a chatbot.

Focus on clarity, structure, and modular architecture.
You can now:

Paste this into Copilot Chat

Use it as /docs/AI_CONTEXT.md

Or load it into any coding agent as system context