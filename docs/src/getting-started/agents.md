# Set up an AI agent

AIScope provides two skills: `aiscope-setup` installs and verifies the CLI; `aiscope` audits the project's coding instructions. Start with the copyable prompt at the top of the [repository README](https://github.com/Jayanth-MKV/aiscope#readme).

## Standalone skills

Run in the project where the agent should use AIScope:

```sh
npx --yes skills add Jayanth-MKV/aiscope --skill aiscope-setup aiscope --agent codex --copy --yes
```

Replace `codex` with your [agent identifier](https://github.com/vercel-labs/skills#supported-agents). This command installs instruction files, not the AIScope executable. `--copy` works without symlink privileges on Windows. Omit `--global` for project scope; add it when you want skills across projects.

Without Node.js, copy `skills/aiscope` and `skills/aiscope-setup` from a checkout into your client's skills directory. Codex uses `.agents/skills/` in a project; Claude Code uses `.claude/skills/`. Keep existing skills. Reload your client if new skills are not discovered immediately.

Ask the agent: `Use the aiscope-setup skill to install AIScope and scan this project.`

## Plugins

Choose a plugin instead of standalone skill installation if your client supports it. The plugin bundles both skills; AIScope's executable is installed during setup. This is a CLI integration and does not declare an MCP server.

Codex CLI:

```sh
codex plugin marketplace add Jayanth-MKV/aiscope
codex plugin add aiscope@aiscope
```

Claude Code:

```text
/plugin marketplace add Jayanth-MKV/aiscope
/plugin install aiscope@aiscope --scope project
```

For local development, replace the repository source with the absolute checkout directory. Manifests follow the [portable plugin format](https://developers.openai.com/plugins/build/plugins) and [Claude Code's plugin format](https://code.claude.com/docs/en/plugins-reference). These repository plugins are not automatically listed in hosted plugin directories.

## Verify

From the target project:

```sh
aiscope --version
aiscope --specific --json .
aiscope --specific check
```

The scan is noninteractive and returns JSON. `check` exits 1 for high-severity conflicts; that is an audit finding, not an installation failure. Options and the project path belong before the subcommand. Review findings before asking the agent to edit instruction files.
