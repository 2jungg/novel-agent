# Novel-Agent Architecture (Draft)

## 1. Goal
A TUI-based autonomous web-novel generation agent that manages world-building, character consistency, and serialized storytelling.

## 2. Tech Stack
- **Language:** Python (for rapid prototyping and LLM orchestration)
- **TUI Framework:** `Textual` or `Rich` (high-quality terminal UI)
- **AI Integration:** 
  - OpenClaw Internal Bridge (reusing existing API keys and sessions)
  - Direct API (LiteLLM or LangChain) for independent operation
- **Database:** JSON/Markdown based (for human-readability and Git-sync)

## 3. Core Components
### A. The Director (State Machine)
- Manages the lifecycle of a novel project.
- States: `Idle`, `WorldBuilding`, `Plotting`, `Writing`, `Reviewing`.

### B. Memory Engine (Context Manager)
- **Lore Book:** World settings, rules, history.
- **Character Ledger:** Traits, evolution, current status.
- **Story Continuity:** Summaries of previous chapters to maintain flow.

### C. Writer Core (Prose Engine)
- Style-guided generation (Few-shot prompting).
- Consistency check against the Lore Book.

## 4. Proposed TUI Layout
- **Left Pane:** Chapter list & Project status.
- **Center Pane:** Live writing/editing terminal.
- **Right Pane:** Lore sidebar (Characters, World info).
- **Bottom:** Log/Status bar.

## 5. Implementation Phases
1. **Phase 1:** Core engine & File structure setup.
2. **Phase 2:** LLM integration (connecting to OpenClaw's providers).
3. **Phase 3:** Textual-based TUI implementation.
4. **Phase 4:** Skill integration (OpenClaw native command support).
