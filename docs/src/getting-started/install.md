# Install

aiscope is a single Rust binary with **zero runtime dependencies**.

## With Cargo

```bash
cargo install aiscope --version 0.1.1 --locked
```

Cargo drops the `aiscope` binary into `~/.cargo/bin/`, which is on your PATH
if you installed Rust via [rustup](https://rustup.rs).

Verify:

```bash
aiscope --version
```

## Pre-built binaries

Each [GitHub Release](https://github.com/Jayanth-MKV/aiscope/releases) ships
pre-built binaries for:

| OS      | Architecture            |
| ------- | ----------------------- |
| Linux   | x86_64                  |
| Linux   | aarch64                 |
| macOS   | x86_64                  |
| macOS   | aarch64 (Apple Silicon) |
| Windows | x86_64                  |

Download the archive for your platform, extract, and put `aiscope` somewhere
on your PATH.

Each archive ships with a `.sha256` file — verify before running:

```bash
sha256sum -c aiscope-v0.1.1-x86_64-unknown-linux-gnu.tar.gz.sha256
```

On macOS, use `shasum -a 256 <archive>` and compare the hash with the checksum file. On Windows, use `Get-FileHash -Algorithm SHA256 <archive>`. Verify before extracting or executing the binary.

## Agent skills and plugins

Use the [agent setup guide](agents.md) to install the setup and audit skills or a Codex/Claude Code plugin. Skills do not replace the CLI installation. npm and PyPI launchers are planned; the npm package named `aiscope` belongs to a different project.

## Build requirements

Only needed if you're building from source:

- Rust **1.85+** (edition 2024)
- A C linker (cc on macOS / Linux, MSVC on Windows)

That's it. No Node, no Python, no native libs.

## Uninstall

```bash
cargo uninstall aiscope
```
