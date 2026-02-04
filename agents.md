# Agents Guide

This repo is a Drupal base project using Docker Compose and Taskfile. Use the commands below to set up, run, and verify the app in a local or CI-friendly environment.

## Prerequisites

- Docker with Compose support.
- Taskfile (`task`) installed.
- Git and standard shell utilities.

## Quick start (local)

1. Clone the repo and enter it.
2. Initialize the local environment:

```bash
task init:local
```

3. Open the app at `http://base.localhost`.

## How to verify the app works

- Confirm containers are up and reachable.
- Load `http://base.localhost` and check the Drupal site renders.
- If the UI or config seems stale, clear cache:

```bash
task drush -- cr
```

## Key Taskfile commands

- `task help` - list available commands.
- `task init:local` - local setup (copies env files, builds images, installs deps, brings services up).
- `task init:workflows` - setup for GitHub workflows.
- `task init:codespaces` - setup for Codespaces (sets public port, outputs URL).
- `task init:ec2` - setup for EC2 (uses override template and pulls images).
- `task build` - build containers.
- `task up` - start containers and wait for DB.
- `task stop` - stop containers.
- `task restart` - stop then start.
- `task logs` - follow service logs.
- `task shell` - open a shell in the PHP container (or pass a service name).

Note: the README table uses `down`, but the Taskfile defines `stop`; use `task stop`.

Optional and destructive:
- `task prune` - removes containers and volumes.
- `task yolo` - recreates the environment and reimports config; destructive by design.

## Drush usage

Run drush via the PHP container:

```bash
task drush -- cr
task drush -- cim -y
```

## Theme generation

Generate a theme from the starterkit:

```bash
task theme
```

You will be prompted for a theme name (defaults to `PROJECT_NAME` from `.env`). After creating a theme, update the Docker configuration as noted in the README.

## Tests and quality checks

- PHPUnit runs in CI (GitHub Actions). If you need to run it locally, use the same workflow container approach described in project docs.
- GrumPHP enforces coding standards and runs checks before commits in CI.

## Where to find more

- `README.md` for detailed setup, Docker image details, and theme workflow.
- `taskfile.yml` for the full list of Taskfile commands and behaviors.

Optional reset (destructive, from README):

```bash
git reset --hard
git clean -fd
```
