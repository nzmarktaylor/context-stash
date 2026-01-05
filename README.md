# context-stash

A workspace-scoped MCP server that provides a durable, Git-native memory layer for AI coding agents.

> **The missing piece in AI-assisted software development**: Give AI agents persistent memory of *why* changes were made.

## Overview

**context-stash** stores atomic context entries as Markdown files inside a `.context/` directory at the root of your project. AI agents reference these entries in code comments (e.g., `// refer to context 00012`) to preserve reasoning and avoid reintroducing historical bugs.

## Why context-stash?

### The Problem: AI Forgets

Every AI coding assistant today suffers from the same flaw: **no persistent memory of past decisions**. This leads to:

- 🔄 Reintroduced bugs the AI fixed yesterday
- 🤔 Repeated questions about architectural decisions
- 💥 Breaking changes that ignore historical constraints
- 📝 Lost context between sessions, models, and tools

### The Solution: A Reasoning Ledger

context-stash creates a **distributed, code-embedded reference system** that works like:

- Git commit messages (explains *what* changed)
- Architectural Decision Records (explains *why* it changed)
- Inline documentation (stays with the code)
- AI reasoning logs (durable across sessions)

**All unified into a single, simple mechanism.**

### Why It Works

🧠 **Persistent Memory** - Context survives sessions, models, and tools  
🔗 **Cross-File References** - One decision can explain changes in multiple files  
📖 **Human-Readable** - Markdown files anyone can read and audit  
🔒 **Immutable by Design** - Historical reasoning stays accurate  
🌍 **Universal** - Works with any MCP-compatible AI agent  
🚀 **Git-Native** - Version control for both code *and* reasoning

## What Makes It Different

### A Shared Language Between Humans and AI

Most AI tooling is either:
- **AI-only** (humans can't read it), or
- **Human-only** (AI ignores it)

context-stash is both:
- ✍️ **AI-generated** - Agents create context automatically
- 🤖 **AI-consumable** - Agents retrieve it on demand
- 👁️ **Human-readable** - Plain Markdown anyone can understand
- ✏️ **Human-editable** - Edit manually when needed
- 📚 **Git-tracked** - Full history of reasoning over time

### Simple, Standard-Ready Design

Like `.gitignore`, `.editorconfig`, and `README.md`, context-stash is:
- Small, obvious, and useful
- Editor-agnostic and model-agnostic
- Easy to adopt, easy to ignore
- Non-intrusive to existing workflows

**This is how standards emerge.**

## Links

- 🌐 **Website**: [https://nzmarktaylor.github.io/context-stash/](https://nzmarktaylor.github.io/context-stash/)
- 📦 **npm**: [https://www.npmjs.com/package/context-stash](https://www.npmjs.com/package/context-stash)
- 💻 **GitHub**: [https://github.com/nzmarktaylor/context-stash](https://github.com/nzmarktaylor/context-stash)
- 📖 **Examples**: [EXAMPLES.md](EXAMPLES.md)
- 🔧 **Development**: [DEVELOPMENT.md](DEVELOPMENT.md)

## Features

- 🧠 **Persistent Memory** - Store reasoning, decisions, and context across AI coding sessions
- 🔒 **Immutable Entries** - Context entries are write-once, preventing accidental modifications
- 📦 **Git-Native** - Plain Markdown files that work seamlessly with version control
- 🔍 **Search & Discovery** - Find relevant context through keyword search
- 🛠️ **MCP Compatible** - Works with any MCP-compatible AI coding agent
- ⚡ **Zero Config** - Sensible defaults with optional customization

## Installation

### Global Installation (Recommended)

```bash
npm install -g context-stash
```

### Project-Specific Installation

```bash
npm install --save-dev context-stash
```

## Quick Start

### 1. Initialize Your Workspace

Navigate to your project root and run:

```bash
context-stash --init
```

This creates:
- `.context/` directory for storing context entries
- `.context/config.json` with default configuration
- `agents.md` with usage instructions for AI agents

### 2. Configure Your AI Agent

Add context-stash to your AI agent's MCP server configuration. For example, in Claude Desktop's config:

```json
{
  "mcpServers": {
    "context-stash": {
      "command": "context-stash",
      "args": ["--serve"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

### 3. Start Using Context

Your AI agent can now:
- **Create context entries**: `context.create` with Markdown content
- **Retrieve entries**: `context.get` with a reference number
- **List all entries**: `context.list`
- **Search entries**: `context.search` with a keyword

## Usage Pattern

### Creating Context Entries

When making a meaningful code change, create a context entry:

```
Agent calls: context.create
Input: { "markdown": "# Fix: Null Pointer in User Service\n\nAdded null check before accessing user.profile..." }
Output: { "file": "00012.md" }
```

### Referencing Context in Code

Add comments to reference context:

```javascript
// refer to context 00012
function getUserProfile(user) {
  if (!user || !user.profile) return null;
  return user.profile;
}
```

### Multiple References

A single context entry can be referenced in multiple files, and code can reference multiple entries:

```python
# refer to context 00012, 00019, 00101
def process_user_data(user):
    # ...
```

## MCP Tools

### `context.create`

Create a new immutable context entry.

**Input:**
```json
{
  "markdown": "string (max 50 lines by default)"
}
```

**Output:**
```json
{
  "file": "00012.md"
}
```

### `context.get`

Retrieve a context entry by reference.

**Input:**
```json
{
  "ref": "00012"
}
```

**Output:**
```json
{
  "markdown": "# Fix: Null Pointer in User Service\n..."
}
```

### `context.list`

List all context entries.

**Output:**
```json
{
  "entries": [
    { "ref": "00001", "file": "00001.md" },
    { "ref": "00002", "file": "00002.md" }
  ]
}
```

### `context.search`

Search context entries by keyword.

**Input:**
```json
{
  "query": "null pointer"
}
```

**Output:**
```json
{
  "results": [
    {
      "ref": "00012",
      "file": "00012.md",
      "snippet": "Added null check before accessing user.profile..."
    }
  ]
}
```

## Configuration

The `.context/config.json` file controls behavior:

```json
{
  "maxLines": 50,
  "startIndex": 1,
  "leadingZeros": 5,
  "filePrefix": "",
  "fileSuffix": ".md"
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `maxLines` | Maximum lines allowed per context entry | `50` |
| `startIndex` | First index number to use | `1` |
| `leadingZeros` | Number of digits in filenames | `5` |
| `filePrefix` | Optional filename prefix | `""` |
| `fileSuffix` | File extension | `".md"` |

### Custom Filename Format

Adjust the config to use custom naming:

```json
{
  "filePrefix": "ctx-",
  "fileSuffix": ".markdown",
  "leadingZeros": 4
}
```

This produces filenames like: `ctx-0123.markdown`

## CLI Commands

### `--init`

Initialize a workspace with context-stash:

```bash
context-stash --init
```

### `--serve`

Start the MCP server (typically called by your AI agent):

```bash
context-stash --serve
```

### `--help`

Show help information:

```bash
context-stash --help
```

## Best Practices

### Keep Entries Atomic

Each context entry should explain one conceptual change or decision:

✅ **Good:**
```markdown
# Fix: Race Condition in Payment Processing

Added mutex lock around balance update to prevent concurrent modifications
that could result in incorrect balance calculations.
```

❌ **Bad:**
```markdown
# Various Changes

Fixed payment bug, updated user service, refactored database layer...
```

### Entries Are Immutable

Never modify existing context entries. If you need to add more information, create a new entry:

```javascript
// refer to context 00012, 00045
// Context 00012: Original fix
// Context 00045: Additional edge case handling
```

### Use Descriptive Titles

Start each entry with a clear title:

```markdown
# Decision: Use PostgreSQL Instead of MongoDB

After evaluating both databases, chose PostgreSQL because...
```

### When to Create Context

Create context entries to capture:

- 🐛 **Bug Fixes**: What broke, why it broke, how you fixed it
- 🎯 **Design Decisions**: Why you chose approach A over B
- ⚠️ **Workarounds**: Why the "proper" solution wasn't feasible
- 🔄 **Refactoring**: What assumptions changed
- 🚫 **Deprecated Code**: What future AI should avoid
- 🧱 **Constraints**: What limitations influenced the design
- 💡 **Intent**: What the code is *trying* to accomplish

**Think of it as a reasoning ledger, not just a change log.**

## Version Control

The `.context/` directory is designed to work with Git:

### Recommended `.gitignore`

Most teams should commit context entries:

```gitignore
# Don't ignore .context/ - it's valuable project documentation!
```

### When to Ignore

Only ignore if your context contains sensitive information:

```gitignore
.context/
```

## Requirements

- **Node.js**: >= 18.0.0
- **Operating System**: Windows, macOS, Linux

## Development

### Building from Source

```bash
git clone https://github.com/nzmarktaylor/context-stash.git
cd context-stash
npm install
npm run build
```

### Testing Locally

```bash
npm link
cd /path/to/test/project
context-stash --init
```

## Troubleshooting

### "Failed to load config" Error

Make sure you've initialized the workspace:

```bash
context-stash --init
```

### MCP Server Not Responding

Ensure the server is launched with the correct working directory (your project root).

### Context Entry Too Long

Reduce the markdown content or increase `maxLines` in `.context/config.json`.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Credits

Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk).

---

**Note**: This is a workspace-scoped MCP server. It must be launched per workspace, not globally, and is sandboxed to the workspace root for security.
