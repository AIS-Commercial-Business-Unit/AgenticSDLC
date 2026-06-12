# FocusFlow — Personal Pomodoro Timer

## Problem
Deep focus is hard. Meetings fragment the day, notifications pull you
out of flow, and at the end of the week you can't say where your
focused time actually went. Existing Pomodoro apps either do too little
(just a countdown) or too much (gamification, social features, premium
tiers).

## Vision
A clean, personal focus timer that helps you work in timed intervals,
tag your sessions to projects or tasks, and see where your focus time
goes over days and weeks. Simple enough to start using in 30 seconds.
Useful enough to keep using.

## Target Users
- **Individual contributor** — developer, designer, analyst, PM — anyone
  who needs uninterrupted focus blocks during the workday

## Core Features (Priority Order)

### P1 — Timer
- Start a focus session with a single click
- Default 25-minute work interval, 5-minute short break, 15-minute long
  break after 4 sessions
- Visual countdown (minutes and seconds remaining)
- Pause and resume a running session
- Cancel a session (does not count in stats)
- Audio or visual notification when a session completes
- Auto-start break after work session (configurable)
- Auto-start next work session after break (configurable)

### P1 — Session Tagging
- Before or during a session, tag it with a label (e.g., "Project Alpha",
  "Code Review", "Learning")
- Manage a personal list of reusable tags
- Untagged sessions default to "Untagged"
- Change or add a tag to a running session

### P2 — Focus Stats
- Daily summary: sessions completed, total focus minutes, breakdown by tag
- Weekly view: bar chart of focus minutes per day, tag distribution
- Streak tracking: consecutive days with at least one completed session
- Simple exportable summary (copy-paste friendly or CSV)

### P3 — Customization
- Adjustable timer durations (work, short break, long break)
- Adjustable sessions-before-long-break count
- Theme preference (light / dark)
- Notification sound on/off

## Non-Functional Requirements
- Instant startup — no loading spinners, no login wall for basic timer
- Works offline (timer must function without network)
- Data persists between browser sessions
- Accessible (WCAG 2.1 AA — keyboard navigable, screen reader friendly)
- Responsive layout (usable on desktop and phone browsers)

## Constraints
- Personal tool — single user, no accounts or multi-user features
- No backend dependency required for core timer functionality
- Keep it simple — this is a utility, not a platform
