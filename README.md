<p align="center">
  <img src="https://raw.githubusercontent.com/jayanth-mkv/aiscope/main/assets/icon.svg" width="132" alt="AIScope scoped-instruction icon">
</p>

<h1 align="center">aiscope</h1>

<p align="center">
  <strong>Local instruction intelligence for AI coding agents.</strong><br>
  Inspect the files that guide your tools, find conflicts, and keep project guidance coherent.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/aiscope-cli"><img alt="npm" src="https://img.shields.io/npm/v/aiscope-cli?style=flat-square"></a>
  <a href="https://pypi.org/project/aiscope-cli/"><img alt="PyPI" src="https://img.shields.io/pypi/v/aiscope-cli?style=flat-square"></a>
  <a href="https://crates.io/crates/aiscope"><img alt="Crates.io" src="https://img.shields.io/crates/v/aiscope?style=flat-square"></a>
  <a href="https://github.com/jayanth-mkv/aiscope/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/jayanth-mkv/aiscope/actions/workflows/ci.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-15242B?style=flat-square"></a>
  <a href="https://jayanth-mkv.github.io/aiscope/"><img alt="User guide" src="https://img.shields.io/badge/user%20guide-open-526771?style=flat-square"></a>
</p>

<p align="center">
  <a href="#what-is-aiscope">What is AIScope?</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="#set-up-with-your-agent">Agent setup</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#privacy--safety">Privacy</a> ·
  <a href="#install">Install</a>
</p>

## Set up with your agent

Copy this prompt into your coding agent:

```text
Set up AIScope for this project using https://github.com/Jayanth-MKV/aiscope.
Read the README and skills/aiscope-setup/SKILL.md from that repository.
Detect my OS and architecture and reuse an existing installation. Prefer
the aiscope-cli npm or PyPI package using an existing package manager;
otherwise install a released binary after checking SHA-256, or use Cargo.
Install the aiscope-setup and aiscope
skills for the agent I am using, scoped to this project. Keep existing
agent configuration. Verify the version, run a noninteractive JSON scan
of this project, and explain any high-severity conflicts with file and
line references. Leave instruction files unchanged unless I ask for fixes.
```

## Installation commands

With Node.js 22+ (downloads a checksum-verified native binary on first run):

```sh
npx --yes aiscope-cli@0.1.2 --version
npx --yes aiscope-cli@0.1.2 --specific --json .
```

Or install through Python, without Rust or Node.js:

```sh
uv tool install aiscope-cli==0.1.2
# Alternatively: pip install aiscope-cli==0.1.2
aiscope --version
```

If Rust and Cargo are installed:

```sh
cargo install aiscope --version 0.1.2 --locked
aiscope --version
aiscope --specific --json .
```

Without Rust, use the [prebuilt release](https://github.com/Jayanth-MKV/aiscope/releases/latest) for your platform. See [installation](docs/src/getting-started/install.md) for checksum verification.

Install both skills for Codex in the current project:

```sh
npx --yes skills add Jayanth-MKV/aiscope --skill aiscope-setup aiscope --agent codex --copy --yes
```

Replace `codex` with `claude-code`, `cursor`, `opencode`, or your [supported agent](https://github.com/vercel-labs/skills#supported-agents). Add `--global` only for installation across projects. Skills teach the agent how to use AIScope; the executable is installed separately. [Plugin and manual setup](docs/src/getting-started/agents.md).

In Claude Code 2.1.275+, install the plugin and both skills in one step:

```text
/plugin install aiscope --marketplace Jayanth-MKV/aiscope --scope project
```

<p align="center">
  <img src="https://raw.githubusercontent.com/jayanth-mkv/aiscope/main/assets/readme-cover.svg" width="92%" alt="AIScope paperback cover: inspect what AI coding tools remember and where their instructions disagree">
</p>

## What is AIScope?

`aiscope` is a local audit tool for the instruction files that shape AI coding-agent workflows. It discovers guidance, prompts, agents, interaction modes, and reusable skills, then shows which instructions overlap or conflict.

The analysis is deterministic and read-only: no LLM calls, network requests, telemetry, or account. Results are available as an interactive terminal UI, compiler-style diagnostics, JSON, text, CI exit codes, and a shareable PNG card.

<p align="center">
  <img src="https://raw.githubusercontent.com/jayanth-mkv/aiscope/main/aiscope-demo.png" width="92%" alt="aiscope terminal audit showing instruction sources and detected conflicts">
</p>

## Documentation

The [AIScope user guide](https://jayanth-mkv.github.io/aiscope/) is the primary documentation for installation, workflows, configuration, and practical usage.

The [API reference on docs.rs](https://docs.rs/aiscope) documents the published Rust crate. This README is embedded as the docs.rs landing page, so repository visitors and crate users begin from the same project overview.

The user guide tracks supported workflows as they evolve; the README keeps the project purpose and safe local-first model visible from the repository and crate entry points.

## Quick start

```bash
cargo install aiscope
cd my-repo
aiscope
```

---

## The problem

You probably run 1–3 AI coding tools side-by-side: Cursor, Claude Code, Copilot, Cline, Aider… Each one stores its memory in **multiple private dotfiles** that nobody ever opens after writing them:

```text
GitHub Copilot:
  .github/copilot-instructions.md
  .github/instructions/*.md           (per-glob applyTo)
  .github/prompts/*.prompt.md         (slash commands)
  .github/chatmodes/*.chatmode.md
  .github/agents/*.md
  AGENTS.md                           (any depth, path-scoped)

Cursor:
  .cursorrules
  .cursor/rules/*.{md,mdc}
  .cursor/commands/*.md
  .cursor/agents/*.md
  .cursor/modes/*.md

Claude Code:
  CLAUDE.md                           (any depth, path-scoped)
  .claude/agents/*.md
  .claude/commands/*.md
  .claude/skills/*/SKILL.md
  ~/.claude/CLAUDE.md                 (with --user)
```

Even if you only use **one** tool, you have rules in 5 places. After six months you have **stale rules, contradicting rules, scope-mismatched rules, and rules that silently override each other** — and you can't see any of it.

`aiscope` reads them all, classifies them by **subsystem** (instructions / prompts / agents / chatmodes / skills), respects **scope** (`applyTo`, `globs`, `alwaysApply`, path-derived prefix), and flags conflicts with compiler-grade source spans.

---

## Features

| Feature                    | Flag                         | What it gives you                                                   |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| Conflict detector          | (default)                    | Points to exact `file:line` where rule X disagrees with rule Y      |
| Subsystem-aware mode       | `--specific`                 | Drops false positives between prompts, instructions, agents, skills |
| User-scope memory          | `--user`                     | Also reads `~/.claude/CLAUDE.md` and other cross-repo files         |
| TUI                        | (default)                    | Two-pane terminal app: sources left, conflicts right                |
| Compiler-grade diagnostics | `--diag`                     | `miette`-style report with byte-precise spans for CI logs           |
| Token-budget breakdown     | (always)                     | "21% of your context window is stale"                               |
| Shareable PNG card         | `--card out.png`             | Portable audit summary for issues, posts, and retrospectives        |
| CI mode                    | `aiscope check`              | Exits 1 only on **high-severity** conflicts (no flapping)           |
| Watch mode                 | `aiscope watch`              | Live re-scan on file change                                         |
| Scriptable                 | `--json`, `--text`, `--grep` | Pipeable into anything                                              |

---

## Architecture

<p align="center">
  <img src="https://raw.githubusercontent.com/jayanth-mkv/aiscope/main/assets/readme-architecture.svg" width="92%" alt="AIScope local architecture from instruction discovery and scope resolution to conflict reasoning and terminal or CI output">
</p>

AIScope is a six-layer deterministic pipeline. **No LLM calls. No network. ~5 MB binary.**

```text
Source files (3 tools × 5 subsystems)
   │
   ▼ Layer 0  scanner          → (Source, raw text)
   │   ├─ Copilot:  .github/{copilot-instructions, instructions/, prompts/,
   │   │            chatmodes/, agents/} + AGENTS.md (any depth, path-scoped)
   │   ├─ Cursor:   .cursorrules, .cursor/{rules,commands,agents,modes}/
   │   └─ Claude:   CLAUDE.md (any depth), .claude/{agents,commands,skills}/
   │
   ▼ Layer 0.5 frontmatter     → Scope { globs, alwaysApply, model, tools }
   │   ├─ Copilot applyTo:  "**/*.ts"
   │   ├─ Cursor  globs:    ["**/*.rs"]
   │   ├─ Cursor  alwaysApply: true
   │   └─ Path-derived:    apps/web/AGENTS.md → "apps/web/**"
   │
   ▼ Layer 1  parse            → Statement (one bullet/paragraph + byte span)
   │   pulldown-cmark CommonMark AST; skips code blocks, headings,
   │   blockquotes, HTML, YAML frontmatter; preserves inline code.
   │
   ▼ Layer 2  canonicalize     → CanonicalText
   │   NFKC + smart-quote/dash → ASCII + Unicode caseless fold +
   │   punctuation strip + Snowball stem (preserves snake_case identifiers).
   │
   ▼ Layer 3  pattern extract  → Assertion { axis, value, polarity, condition }
   │   Polarity (Forbid/Prefer/Allow) + clause splitter + condition extractor +
   │   10 axes with topic-gating. Confidence 0.85–0.97 per match.
   │
   ▼ Layer 4  reason           → Conflict { kind, severity, confidence }
   │   ├─ Duplicate (cross-source SHA-256 fingerprint)
   │   ├─ Clash (same axis, both Prefer, different values)
   │   ├─ PolarityConflict (same value, opposite polarity)
   │   └─ DuplicateName (agent/skill/chatmode `name:` collision)
   │   Severity = High iff cross-source AND conf≥0.85 AND scopes overlap.
   │
   ▼ Layer 5  render           → TUI / miette diag / JSON / PNG card
```

### Two reasoning modes

- **Uniform** _(default)_: every cross-file pair is a candidate conflict. Subsystem boundaries are ignored. Best for "show me everything that _could_ contradict".

- **Specific** _(`--specific`)_: subsystem-aware. Prompts ↔ Instructions never conflict (different intent). Agents ↔ non-Agents never conflict (isolated runners). Skills/ChatModes only check duplicate names + tool allowlists. Best for low-noise CI.

### Scope-aware severity

Two rules with **non-overlapping** `applyTo` globs (e.g. `**/*.ts` vs `**/*.py`) still surface as conflicts — but downgraded to `Severity::Low` with a `(scopes don't overlap)` note. `aiscope check` ignores them; the TUI shows them.

---

## Privacy & safety

- **Read-only.** Never modifies your files.
- **Local only.** No telemetry, no network, no account, no API key.
- **No session-log access.** v0.1 will not open `~/.claude/projects/*.jsonl` (chat history). Only rules and instruction files. Enforced by [tests/privacy_guard.rs](tests/privacy_guard.rs).
- **No TLS interception.** Not a proxy. Just walks your dotfiles.

---

## Install

```bash
cargo install aiscope            # 5 MB self-contained binary
```

Prebuilt binaries are available through [GitHub Releases](https://github.com/Jayanth-MKV/aiscope/releases/latest). The npm and PyPI package name is `aiscope-cli`; both expose `aiscope`. npm supports macOS x64/ARM64, glibc Linux x64/ARM64 and Windows x64. Its first launch downloads and verifies SHA-256 for a native binary, then caches it; Python wheels bundle that binary. Audits themselves stay offline. `AISCOPE_CACHE_DIR` changes the npm cache location; `AISCOPE_BINARY_PATH` selects an explicitly trusted existing binary.

---

## Usage

```bash
aiscope                          # TUI in current dir
aiscope --diag                   # compiler-grade report for CI logs
aiscope --card out.png           # 1280×720 PNG of the TUI for sharing
aiscope --json | jq              # scriptable
aiscope --grep "snake_case"      # filter rules
aiscope --specific               # subsystem-aware (low-noise mode)
aiscope --user                   # also read ~/.claude/CLAUDE.md
aiscope check                    # CI: exit 1 on high-severity conflicts
aiscope watch                    # live re-scan
```

### CI

```yaml
# .github/workflows/aiscope.yml
- run: cargo install aiscope
- run: aiscope check
```

---

## Tech stack

| Crate                                | Role                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| `pulldown-cmark`                     | CommonMark AST with byte offsets                      |
| `unicode-normalization` + `caseless` | Unicode-correct fold (Turkish-safe)                   |
| `rust-stemmers`                      | Snowball stem for paraphrase-resistant fingerprinting |
| `regex`                              | Polarity / axis pattern matching                      |
| `globset`                            | `applyTo` / `globs` overlap test                      |
| `miette`                             | Compiler-grade diagnostics                            |
| `tiktoken-rs`                        | OpenAI BPE tokenizer for token-budget math            |
| `tiny-skia` + `cosmic-text`          | PNG card (pure Rust, no headless browser)             |
| JetBrains Mono                       | Embedded monospace font (270 KB, Apache-2.0)          |
| `ratatui` + `crossterm`              | TUI                                                   |
| `clap`                               | CLI                                                   |
| `insta`                              | Snapshot determinism gate                             |

---

## What to test

```bash
# 1. All unit + integration tests (42 tests across 5 binaries)
cargo test --all

# 2. Lint
cargo clippy --all-targets -- -D warnings

# 3. Release build
cargo build --release

# 4. Live demo against the bundled Copilot-only fixture
cargo run --release -- --diag .\tests\fixtures\copilot-only
cargo run --release -- --card demo.png .\tests\fixtures\copilot-only
cargo run --release -- check .\tests\fixtures\copilot-only; echo $LASTEXITCODE
cargo run --release -- --specific --diag .\tests\fixtures\copilot-only
```

### Fixtures shipped in the repo

| Fixture                                   | Tests                                              |
| ----------------------------------------- | -------------------------------------------------- |
| `tests/fixtures/{cursor,claude,copilot}/` | Three-tool cross-conflict (smoke test)             |
| `tests/fixtures/copilot-only/`            | Single-tool repo with all 5 subsystems             |
| `tests/corpus/negation_clause.md`         | "Don't X, prefer Y" → 2 clauses, no self-clash     |
| `tests/corpus/historical_narrative.md`    | "We migrated from npm to pnpm" → 0 false positives |
| `tests/corpus/conditional_clauses.md`     | "snake_case in legacy, camelCase in new"           |
| `tests/corpus/frontmatter_and_code.md`    | YAML + code blocks + blockquotes all skipped       |
| `tests/corpus/multi_axis.md`              | Indentation + comments + imports in 3 lines        |

Snapshots are pinned in `tests/snapshots/`. To accept intentional changes: `cargo insta review`.

---

## Roadmap

- v0.2 — `semantic` feature: fastembed paraphrase recall, MCP server inventory, opt-in session-log scanning, git-aware memory diff
- v0.3 — `aiscope traffic` proxy mode (live cost monitoring)
- v0.4 — hosted shareable snapshot URLs
- v0.5 — cross-tool memory port (`aiscope port cursor → claude`)

## Registries and agent discovery

AIScope is published on [npm](https://www.npmjs.com/package/aiscope-cli), [PyPI](https://pypi.org/project/aiscope-cli/) and [crates.io](https://crates.io/crates/aiscope). Its Rust documentation is on [docs.rs](https://docs.rs/aiscope), and the crate is indexed by [lib.rs](https://lib.rs/crates/aiscope).

The [AIScope](https://clawhub.ai/jayanth-mkv/skills/aiscope) and [setup](https://clawhub.ai/jayanth-mkv/skills/aiscope-setup) skills are published on ClawHub. GitHub installation commands appear above. ClawHub distributes its skill copies under MIT-0; this repository remains MIT licensed, with the font license described below.

GitHub Actions previews skill changes on pushes to main. Releases publish changed skills when the `CLAWHUB_TOKEN` Actions secret and `PUBLISH_CLAWHUB=true` repository variable are configured. Manual runs of `publish-skills.yml` default to preview. The workflow checks the authenticated ClawHub owner against the source repository owner. AIScope is a CLI; it does not currently expose an MCP server.

## License

MIT (aiscope source) · Apache-2.0 (embedded JetBrains Mono font)
