# Publishing AIScope

| Setting | Value |
| --- | --- |
| GitHub repository | `jayanth-mkv/aiscope` |
| npm account | `jayanth-mkv` |
| npm package | `aiscope-cli` |
| PyPI account | `jayanth-mkv` |
| PyPI project | `aiscope-cli` |
| crates.io crate | `aiscope` |
| Workflow filename | `release.yml` |
| npm environment | `npm` |
| PyPI environment | `pypi` |

The public author is Xplormity Collective. Registry account names identify publishing access, not authorship.

Configure npm trusted publishing for this repository, `release.yml`, and environment `npm`, with publishing allowed. Configure PyPI with the same GitHub repository and workflow, environment `pypi`. For the initial PyPI release, sign into the intended owner account and create a pending publisher whose project name is exactly `aiscope-cli`.

No npm token, `.npmrc` credential or `.pypirc` credential belongs in this repository. npm and PyPI releases authenticate through GitHub OIDC. Cargo currently uses the protected `CARGO_REGISTRY_TOKEN` GitHub secret; never put its value in a repository variable.

Synchronize Cargo.toml, Cargo.lock's AIScope entry, package.json, pyproject.toml, npm/runtime.js and plugin manifests before an annotated `vX.Y.Z` tag. The workflow builds five native platforms and Python wheels, creates the GitHub release, then publishes registry packages. The npm launcher requires the matching release binaries and SHA-256 files to be public first.

GitHub's Packages panel shows GitHub-hosted packages. npm, PyPI and crates.io releases are linked from the README and GitHub release assets.
