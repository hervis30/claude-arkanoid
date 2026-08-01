# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is a pre-implementation Arkanoid/Breakout game project. As of now it contains **no application code** — only game assets and a spec-driven workflow setup:

- `assets/spritesheet-breakout.png` — sprite sheet for paddle, ball, and colored blocks (gray, red, yellow, cyan, magenta, hotpink, green).
- `assets/spritesheet.js` — vanilla JS helper for loading the sprite sheet onto an offscreen canvas and drawing sprites/animation frames (`loadSpritesheet`, `drawSprite`, `drawFrame`). Defines `SPRITES` (paddle/ball/blocks source rects) and `EXPLOSION_FRAMES` (4-frame explosion animation per color, `EXPLOSION_DURATION` 150ms).
- `assets/sounds/ball-bounce.mp3`, `assets/sounds/break-sound.mp3` — sound effects.

There is no build system, package.json, test runner, or entry HTML/JS file yet. Do not assume a framework — none has been chosen. The sprite helper (`assets/spritesheet.js`) is written as plain browser JS with no imports/exports, suggesting a no-build, plain HTML5 Canvas approach, but confirm against the spec before assuming.

## Spec-driven workflow (required process for new features)

This repo uses a two-phase spec workflow via custom skills in `.agents/skills/` (mirrored in `.claude/skills/`). **Follow this process instead of jumping straight to code:**

1. **`/spec <description>`** (`.agents/skills/spec/SKILL.md`) — Guided, conversational spec design. Does NOT write code. Asks clarifying questions in blocks of 3-5, then builds the spec section-by-section (Header, Scope, Data model, Implementation plan, Acceptance criteria, Decisions, Risks) with user confirmation after each section. Saves the result to `specs/NN-slug.md` in `Draft` state, using `.agents/skills/spec/template.md` as the structural template. On first use it seeds `specs/.spec-config.yml` with `AutoCreateBranch: true`.
2. **`/spec-impl <NN-slug>`** (`.agents/skills/spec-impl/SKILL.md`) — Implements an approved spec. Refuses to proceed unless the spec's status line means "Approved" (in any language — the human must change `Draft` → `Approved` manually). Creates/switches to git branch `spec-NN-slug` (behavior controlled by `AutoCreateBranch` in `specs/.spec-config.yml`), then implements the plan **one step at a time**, pausing after each step for the user to review the diff before continuing.

Key rules baked into these skills that apply whenever you're asked to plan or build a feature here:
- Never write code while designing a spec; never start implementing a spec that isn't `Approved`.
- Specs live in `specs/` (this directory doesn't exist yet — the first `/spec` invocation creates it).
- Implementation strictly follows the spec's plan; ambiguities found mid-implementation are surfaced as options to the user, not silently resolved.
- Out-of-scope requests during implementation are deferred to a future spec, not folded into the current branch.

Note: this repo is **not currently a git repository** (no `.git` present), so branch-creation steps in `/spec-impl` will need `git init` first.
