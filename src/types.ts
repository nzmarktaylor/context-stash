/**
 * Configuration for context-stash
 */
export interface Config {
  maxLines: number;
  startIndex: number;
  leadingZeros: number;
  filePrefix: string;
  fileSuffix: string;
}

/**
 * Represents a context entry reference
 */
export interface ContextEntry {
  ref: string;
  file: string;
}

/**
 * Result of a context search
 */
export interface SearchResult {
  ref: string;
  file: string;
  snippet: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Config = {
  maxLines: 50,
  startIndex: 1,
  leadingZeros: 5,
  filePrefix: "",
  fileSuffix: ".md"
};

/**
 * Default agents.md content
 */
export const AGENTS_MD_CONTENT = `# Context Stash (MCP Tool)

This project uses **context‑stash**, a workspace‑local MCP server that stores durable reasoning context for AI coding agents.

## Purpose

Context entries explain *why* code changes were made. They help prevent reintroducing historical bugs and allow AI agents to understand the intent behind modifications.

## Usage Pattern

- When making a meaningful code change, call the MCP tool \`context.create\` with a short Markdown explanation.
- The tool returns a reference number (e.g., \`00012\`).
- Insert comments in relevant files such as:

\`\`\`
// refer to context 00012
\`\`\`

- Context entries are **immutable**. If new reasoning is needed, create a new entry rather than modifying an old one.
- A single context entry may be referenced in many files.
- Code may reference multiple entries:

\`\`\`
// refer to context 00012, 00019, 00101
\`\`\`

## When to Create Context

Create context entries for:

- **Bug Fixes**: What broke, why it broke, and how you fixed it
- **Design Decisions**: Why you chose approach A over B
- **Workarounds**: Why the "proper" solution wasn't feasible
- **Refactoring**: What assumptions changed and why
- **Constraints**: What limitations influenced the design
- **Deprecated Code**: What future AI should avoid and why
- **Intent Clarification**: What the code is trying to accomplish beyond what's obvious

**Do NOT create context for:**
- Trivial changes (formatting, typos)
- Self-explanatory code changes
- Temporary experiments
- Changes that are fully explained by existing documentation

## Writing Good Context

### Use Clear Structure

\`\`\`markdown
# Brief Title (Bug Fix / Decision / Workaround)

## Problem / Context
What situation led to this change?

## Solution / Decision
What did you do and why?

## Alternatives Considered (optional)
What other approaches were rejected and why?

## Impact (optional)
What files/systems does this affect?
\`\`\`

### Be Concise But Complete

- Max 50 lines by default (configurable)
- Focus on **WHY**, not just WHAT
- Include enough detail that future AI can understand the reasoning
- Avoid unnecessary verbosity

### Think Cross-Session

Remember: You might not be the AI agent that reads this later. Write for:
- Different AI models
- Future versions of yourself
- Human developers reviewing code
- Team members unfamiliar with the change

## Best Practices for AI Agents

### Before Making Changes

1. **Search existing context**: Use \`context.search\` to check if similar issues were addressed
2. **List recent context**: Use \`context.list\` to see what decisions were made recently
3. **Read referenced context**: If you see \`// refer to context XXXXX\`, call \`context.get\` to understand WHY the code exists

### When Making Changes

1. **Create context FIRST** if the change needs explanation
2. **Add references IMMEDIATELY** after creating context
3. **Be consistent** with comment format: \`// refer to context 00012\`

### Important Reminders

- **NEVER edit existing context files** in \`.context/\` - they are immutable
- **ALWAYS reference context** when the reasoning isn't obvious from the code alone
- **CHECK for existing context** before assuming you know the full story
- **CREATE new context** if you discover additional information about an old decision

## Project-Specific Guidelines

### TypeScript Project

This is a TypeScript project targeting Node.js 18+. When working with this codebase:

- Use explicit types for function parameters and return values
- Prefer \`async/await\` over raw promises
- Use ES modules (\`import/export\`) not CommonJS
- Follow existing code style and conventions
- Add JSDoc comments for public APIs

### MCP Server Implementation

Key architectural decisions for this project:

- **Stdio transport**: The server uses stdio for communication (not TCP/HTTP)
- **Workspace-scoped**: All operations must be sandboxed to \`process.cwd()\`
- **Path validation**: Always validate paths to prevent directory traversal
- **Immutability**: Context entries are write-once by design
- **Simplicity**: The server should stay "dumb" - no AI interpretation, just storage

### Security Considerations

- Never allow path traversal outside workspace root
- No network operations (stdio only)
- Validate all user inputs
- Keep dependencies minimal

## MCP Server

To enable this tool, configure your agent to launch:

\`\`\`
context-stash --serve
\`\`\`

The server must be launched with the workspace root as the working directory.

## Questions?

If you're unsure whether to create context, err on the side of **creating it**. It's better to have too much reasoning documented than too little.
`;
