# Context Stash (MCP Tool)

This project uses **context‑stash**, a workspace‑local MCP server that stores durable reasoning context for AI coding agents.

## Purpose

Context entries explain *why* code changes were made. They help prevent reintroducing historical bugs and allow AI agents to understand the intent behind modifications.

## Usage Pattern

- When making a meaningful code change, call the MCP tool `context.create` with a short Markdown explanation.
- The tool returns a reference number (e.g., `00012`).
- Insert comments in relevant files such as:

```
// refer to context 00012
```

- Context entries are **immutable**. If new reasoning is needed, create a new entry rather than modifying an old one.
- A single context entry may be referenced in many files.
- Code may reference multiple entries:

```
// refer to context 00012, 00019, 00101
```

## MCP Server

To enable this tool, configure your agent to launch:

```
context-stash --serve
```

The server must be launched with the workspace root as the working directory.
