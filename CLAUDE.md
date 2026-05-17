# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first React web app — a scavenger hunt ARG (Alternate Reality Game) for Phillies fans to play during a game at Citizens Bank Park. The story is helping the Philly Phanatic recover the missing pieces of his scorecard. Players complete a series of mini-games in sequence to collect pieces, then assemble them in a final drag-and-drop jigsaw puzzle.

Full requirements and planning Q&A are in `planning/`. User stories are in `planning/stories/` as individual `.md` files. The prioritized backlog is at `planning/stories/BACKLOG.md` — check it to understand build order and the reasoning behind it. Reminders for returning sessions are in `planning/reminders.md`.

## Stack

- **React 18** with **TypeScript**
- **Vite** — build tool and dev server
- **React Router** — client-side routing between screens
- **Tailwind CSS** — styling, no component library
- **Vitest + React Testing Library** — unit and component tests

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
npm run test     # Vitest (watch mode)
npm run test:run # Vitest (single run, for CI)
```

## Project Structure

```
src/
  games/                        # One folder per game
    stadium-quiz/
      StadiumQuiz.tsx           # Game component (implements GameProps)
      stadiumQuizData.ts        # Hardcoded questions/answers
    mascot-friends/
      MascotFriends.tsx
      mascotData.ts
  components/                   # Shared UI used across games
    MultipleChoiceQuestion.tsx
    PieceFoundCelebration.tsx
    JigsawPuzzle.tsx
  hooks/
    useProgress.ts              # All localStorage reads/writes
  screens/                      # Top-level route screens
    IntroScreen.tsx
    SequenceScreen.tsx
    CongratsScreen.tsx
  config/
    games.ts                    # Single source of truth for game sequence
```

Game-specific data (questions, mascot lists, etc.) lives in the same folder as the game component, not in a global `data/` directory.

## Architecture

### Game System
Every game is a React component that implements the same interface:

```tsx
interface GameProps {
  gameId: string;
  onComplete: (pieceId: string) => void;
}
```

The `onComplete` callback is the only required contract. When called, the sequence controller records the piece and routes to the celebration screen. Adding a new game means implementing this interface and registering it in the game config — nothing else changes.

### Game Sequence Config
Games are defined in a single config array (not hardcoded into routing logic). Each entry declares its `gameId`, component, display name, and the `pieceId` it awards. The sequence screen and routing derive everything from this array. This is how the game order can be changed, or the design switched from a linear sequence to a hub, without touching individual game components.

### Progress Persistence
All game state lives in `localStorage`. No authentication, no server calls. The shape is:
- `completedGames`: string[] of completed `gameId`s
- `collectedPieces`: string[] of collected `pieceId`s
- `gameComplete`: boolean

A single custom hook (e.g., `useProgress`) wraps all reads and writes. Components never call `localStorage` directly.

### Routing
On app load, the progress hook determines the entry route:
- No progress → Intro screen
- In progress → Sequence screen (or active game)
- All games complete + puzzle complete → Congratulations screen

### Reusable Components
- **MultipleChoiceQuestion** — takes a question string, options array, and `onCorrect` callback. Manages its own greyed-out state for wrong answers. Used by Stadium Quiz and Name That Player.
- **MascotCard** — used by the Mascot Friends game for the multi-select rounds.
- **PieceFoundCelebration** — full-screen overlay shown after any `onComplete` fires, before routing back to the sequence.
- **JigsawPuzzle** — drag-and-drop engine. Receives a `pieces` array (id + image + correct drop zone). The piece count is driven entirely by the config — the engine itself never changes when games are added.

## Conventions

- **File names**: PascalCase for components (`StadiumQuiz.tsx`), camelCase for everything else (`stadiumQuizData.ts`, `useProgress.ts`)
- **Component exports**: named exports only, no default exports
- **Game data**: typed with explicit interfaces, not inferred from literals — questions, options, and correct answers all have declared types
- **localStorage**: only accessed through `useProgress` — never call `localStorage` directly from a component
- **Tailwind**: mobile-first (`sm:` and up), no custom CSS files unless Tailwind cannot do it

## Testing Standards

- Test files live next to the file they test: `StadiumQuiz.test.tsx` alongside `StadiumQuiz.tsx`
- Test the game contract: each game component should have a test that calls `onComplete` when the player wins
- Test `useProgress` for read/write/clear behavior against a mocked `localStorage`
- Do not test Tailwind class names or visual appearance — test behavior and state
- Test structure will be arrange/act/assert
- coverage: 80% minimum for new code

## Code Style

- TypeScript strict mode on
- Prefer `interface` over `type` for component props and data shapes
- No `any` — use `unknown` and narrow, or define a proper type
- Keep game components focused on game logic; delegate all progress writes to `useProgress`
- No magic numbers

## Key Constraints

- **Offline-first**: All MVP content (quiz questions, mascot data) is hardcoded. No network calls in the critical path.
- **Child-friendly**: Every game must be winnable by a child. Wrong answers grey out (never removed). Hint text shown after wrong guesses.
- **No money**: Player spends nothing beyond their ticket. No IAP, no subscriptions, no premium hints.
- **No auth**: No accounts, no login. localStorage only.
- **Post-MVP MLB API**: The Name That Player game component must be structured so hardcoded answers can be swapped for API data without changing the component interface.

## Games (MVP)

| Order | Game | Mechanic | MVP | Completed |
|-------|------|----------|-----|-----------|
| 1 | Stadium Observation Quiz | Multiple choice, 4–5 questions about Citizens Bank Park | Yes | No |

> App scaffold (US1) is complete. React + TypeScript + Vite + Tailwind + React Router + Vitest are all configured.
| 2 | Name That Player | Multiple choice, questions about the Phillies roster | No | No |
| 3 | Mascot Friends | Multi-select, 3 rounds of 4 mascots — pick the Phanatic's friend | No | No |
| 4 | Final Puzzle | Drag-and-drop jigsaw, 5 pieces, unlocks only after games 1–3 complete | No | No |

Completing the final puzzle leads to a congratulations screen crediting the player as a member of the "Scorecard Recovery Crew".
