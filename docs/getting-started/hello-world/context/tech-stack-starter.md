# Tech Stack — Starter Recommendation

This is the recommended tech stack for the simplest possible setup.
Copy this file into `.project-context/` alongside the project brief,
or paste the preferences section directly into the brief.

The goal: `npm install && npm start` and you're running.

## Technical Preferences
- TypeScript (strict mode)
- React with Vite for the frontend
- localStorage for persistence (no database server)
- Single-page app — no backend required for MVP
- Vitest for unit tests
- Deploy as a static site (or just run locally)

## Why This Stack
- **No database to install.** localStorage handles single-user
  persistence. The framework can always add a backend in a later spec.
- **No server process.** Vite dev server is the only thing running.
- **One command to start.** `npm run dev` and open the browser.
- **TypeScript catches bugs early.** Strict mode is a good habit even
  for small projects.

## Want Something Different?

This is a demo — the whole point is to explore. Replace this file with
your own tech preferences and the framework will design around them.

Some ideas to try:

**Python + Flask**
```
- Python 3.12 with type hints
- Flask for a lightweight web server
- SQLite for persistence
- Jinja2 templates (server-rendered HTML)
- pytest for testing
```

**Go + HTMX**
```
- Go 1.22
- Standard library net/http (no framework)
- SQLite via modernc.org/sqlite (pure Go, no CGO)
- HTMX for interactive UI without a JS framework
- Go testing package
```

**Vanilla (No Framework)**
```
- Plain HTML, CSS, and JavaScript (no TypeScript, no framework)
- localStorage for persistence
- Single index.html file
- No build step — just open the file in a browser
```

**C# / Blazor**
```
- .NET 10
- Blazor WebAssembly (runs in browser, no server)
- localStorage via Blazored.LocalStorage
- xUnit for testing
```

To use any of these: create a `tech-stack.md` in `.project-context/`
with your chosen stack and run `/ais.setup.plan`. The framework reads
everything in that folder.
