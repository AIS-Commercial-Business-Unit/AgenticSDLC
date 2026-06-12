# Discovery Call Transcript

**Date**: February 10, 2026
**Attendees**:
- Jamie Reeves, VP of Engineering (Velocity Labs)
- Priya Sharma, Squad Lead (Velocity Labs)
- David Park, Solutions Architect (AIS)
- Lisa Wong, Account Executive (AIS)

---

**Lisa Wong (AIS)**: Thanks for taking the time today. We've reviewed the
RFP and want to make sure we scope this right. Jamie, can you start with
what's driving this?

**Jamie Reeves (Velocity Labs)**: Sure. We're a 30-developer team across
four squads. The core problem is focus fragmentation. People get pulled
into meetings, Slack threads, ad-hoc requests — and there's no structure
around deep work. We tried calendar blocking but nobody sticks with it
because there's no tool reinforcing the habit.

**David Park (AIS)**: And you landed on Pomodoro specifically?

**Jamie Reeves (Velocity Labs)**: Yeah, a few of us have used Pomodoro apps
individually and it works. But existing apps are either too simple — just a
countdown — or too bloated with team features we don't need. We want
something in between: a solid timer with session tagging so you know where
your time went.

**David Park (AIS)**: Priya, from a squad lead perspective, what would be
most valuable?

**Priya Sharma (Velocity Labs)**: The tagging is the big one for me. Right
now I have no visibility into how much focus time my squad spends on
feature work vs. bug fixes vs. tech debt. If developers tag their sessions,
I can see patterns in retros. I don't need a dashboard — even a weekly
summary or export would be enough.

**David Park (AIS)**: Got it. So the stats and tagging are really about
individual awareness plus team conversation, not management surveillance?

**Jamie Reeves (Velocity Labs)**: Exactly. This is a personal tool. We're
not tracking anyone. Each person sees their own data. If they want to share
a weekly summary in retro, that's their choice.

**David Park (AIS)**: That simplifies things a lot. Let's talk tech. The
RFP mentions web-based, React/TypeScript preferred. Any constraints beyond
that?

**Jamie Reeves (Velocity Labs)**: We're a React shop so that's natural. But
the key thing is: no backend. I don't want to host a server for a timer
app. Everything should run in the browser and persist locally. localStorage
is fine.

**Priya Sharma (Velocity Labs)**: And it needs to work offline. I work from
coffee shops and flights pretty often. If I can't use it without Wi-Fi,
it's useless.

**David Park (AIS)**: Makes sense. What about the timer itself — any strong
opinions on behavior? The standard is 25 work / 5 short break / 15 long
break after 4 sessions.

**Jamie Reeves (Velocity Labs)**: Start with the standard but make it
configurable. Some people prefer 50/10. The auto-start option matters too —
some people want breaks to start automatically, others want to manually
trigger the next session.

**David Park (AIS)**: What about edge cases — browser gets closed
mid-session, laptop goes to sleep?

**Priya Sharma (Velocity Labs)**: Good question. If I close my laptop
during a session and open it later, I'd expect it to know the session was
interrupted. Don't just silently lose it. Either resume or mark it
incomplete — something sensible.

**David Park (AIS)**: That's helpful. On notifications — what works for
your team?

**Jamie Reeves (Velocity Labs)**: Audio notification when a session ends,
with a visual indicator too. But it needs to be toggleable — some people
work with headphones, some don't. And nothing obnoxious.

**Lisa Wong (AIS)**: What about the timeline? The RFP says 4-6 weeks.

**Jamie Reeves (Velocity Labs)**: That's our hope. The timer and tagging
are the priority. Stats can come after if it takes longer. I'd rather have
a solid timer in 3 weeks than a mediocre everything in 6.

**Priya Sharma (Velocity Labs)**: Agreed. Timer first, tagging second,
stats third. Customization can be sprinkled in as we go.

**David Park (AIS)**: That maps well to a phased approach. One more thing —
accessibility. The RFP mentions WCAG 2.1 AA. Is that a hard requirement?

**Jamie Reeves (Velocity Labs)**: Yes. We have a couple of team members who
rely on keyboard navigation. The timer controls need to be fully accessible.
Screen reader support for the countdown state would be ideal.

**Lisa Wong (AIS)**: This is really clear. We'll put together a what-we-heard
document to confirm we captured everything, then move to a proposal.

**Jamie Reeves (Velocity Labs)**: Sounds good. Looking forward to it.
