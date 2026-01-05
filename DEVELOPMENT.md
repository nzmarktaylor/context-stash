# Development Guide

This guide is for contributors and maintainers of context-stash.

## Project Structure

```
context-stash/
├── src/                   # TypeScript source code
│   ├── cli.ts            # CLI entry point (--init, --serve, --help)
│   ├── server.ts         # MCP server implementation
│   ├── utils.ts          # Utility functions (config, file ops)
│   ├── types.ts          # TypeScript type definitions
│   └── index.ts          # Main export file
├── dist/                 # Compiled JavaScript (generated)
├── specifications/       # Original specification documents
├── node_modules/         # Dependencies (generated)
├── package.json          # npm package configuration
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
├── .npmignore           # npm publish ignore rules
├── README.md            # Main documentation
├── CHANGELOG.md         # Version history
├── EXAMPLES.md          # Usage examples
├── MCP_CONFIG_EXAMPLES.md # Configuration examples
├── PUBLISHING.md        # Publishing guide
└── LICENSE              # MIT License

```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/context-stash.git
cd context-stash

# Install dependencies
npm install

# Build the project
npm run build
```

## Development Workflow

### Making Changes

1. **Edit TypeScript files** in `src/`
2. **Build** to compile: `npm run build`
3. **Test locally**: `node dist/cli.js --help`

### Watch Mode

For continuous development:

```bash
npm run watch
```

This automatically rebuilds when you save files.

### Testing Changes Locally

Link the package globally for testing:

```bash
npm link
cd /path/to/test/project
context-stash --init
```

Unlink when done:

```bash
npm unlink -g context-stash
```

## Architecture

### Core Components

#### 1. CLI (`cli.ts`)

Entry point for command-line usage. Handles:
- `--init`: Workspace initialization
- `--serve`: Start MCP server
- `--help`: Display help

#### 2. MCP Server (`server.ts`)

Implements the Model Context Protocol server with four tools:

- **context.create**: Create new context entries
- **context.get**: Retrieve entries by reference
- **context.list**: List all entries
- **context.search**: Search by keyword

Uses stdio transport for communication with AI agents.

#### 3. Utilities (`utils.ts`)

Helper functions:
- `loadConfig()`: Load configuration from `.context/config.json`
- `initializeWorkspace()`: Set up `.context/` directory and files
- `formatFilename()`: Generate filenames from indices
- `getNextIndex()`: Find next available index
- `validatePath()`: Prevent directory traversal attacks

#### 4. Types (`types.ts`)

TypeScript interfaces and constants:
- `Config`: Configuration structure
- `ContextEntry`: Entry metadata
- `SearchResult`: Search result structure
- `DEFAULT_CONFIG`: Default configuration values
- `AGENTS_MD_CONTENT`: Template for agents.md

## Key Design Decisions

### Why Stdio Transport?

The MCP protocol supports stdio for local, per-workspace servers. This ensures:
- Sandboxing to workspace directory
- No network ports required
- Simple process management

### Why Immutable Entries?

Context entries are write-once to:
- Prevent accidental modifications
- Maintain historical accuracy
- Simplify version control
- Preserve the "reasoning ledger" integrity

### Why Markdown?

Markdown is:
- Human-readable
- Git-friendly
- Widely supported
- Easy to edit manually if needed
- The perfect format for a "shared language" between humans and AI

### Why Leading Zeros?

Filenames like `00012.md` ensure:
- Proper alphabetical sorting
- Easy visual scanning
- Configurable for different project sizes

### Why Keep It Simple?

The server is intentionally "dumb":
- No code interpretation
- No semantic understanding
- No model dependencies
- Just reliable, deterministic storage

**This makes it universal.** Any AI agent can use it without understanding your entire system.

### The "Cross-File, Cross-Time Memory Graph"

By allowing the same context reference (e.g., `// refer to context 00012`) to appear in multiple files, we create:

- A distributed reference system embedded in code
- Historical reasoning that travels with the code
- A bridge between human intent and AI understanding

This mirrors how humans think: "This change touches three files because of one underlying reason."

## Testing

### Manual Testing

Create a test project:

```bash
mkdir test-project
cd test-project
context-stash --init
```

Test MCP tools (requires MCP-compatible client).

### Future: Automated Tests

TODO: Add unit tests with a framework like Jest or Vitest:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Example test structure:

```typescript
// tests/utils.test.ts
import { formatFilename } from '../src/utils';
import { DEFAULT_CONFIG } from '../src/types';

describe('formatFilename', () => {
  it('should format with leading zeros', () => {
    expect(formatFilename(12, DEFAULT_CONFIG)).toBe('00012.md');
  });
});
```

## Code Style

### TypeScript Guidelines

- Use explicit types for function parameters
- Prefer interfaces over type aliases for objects
- Use `async/await` over promises
- Handle errors with try/catch blocks

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Functions**: `camelCase()`
- **Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Comments

Add comments for:
- Public API functions
- Complex logic
- Non-obvious design decisions

Use JSDoc format:

```typescript
/**
 * Load configuration from .context/config.json
 * @param workspaceRoot - Absolute path to workspace
 * @returns Merged configuration with defaults
 */
export async function loadConfig(workspaceRoot: string): Promise<Config> {
  // ...
}
```

## Security Considerations

### Path Validation

Always validate paths to prevent directory traversal:

```typescript
validatePath(filePath, workspaceRoot);
```

### No External Network

The server should never make external network requests.

### Stdio Only

Never open network sockets. Use stdio for MCP communication.

## Adding New Features

### Adding a New MCP Tool

1. **Define the tool** in `server.ts`:

```typescript
{
  name: 'context.mytool',
  description: 'Description of the tool',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string' }
    },
    required: ['param']
  }
}
```

2. **Implement the handler**:

```typescript
async function handleMyTool(args: any) {
  // Implementation
}
```

3. **Add to switch statement**:

```typescript
case 'context.mytool':
  return await handleMyTool(request.params.arguments);
```

4. **Update documentation** in README.md

### Adding Configuration Options

1. **Update `Config` interface** in `types.ts`
2. **Update `DEFAULT_CONFIG`** with default value
3. **Use in implementation**
4. **Document** in README.md

## Debugging

### Enable Verbose Logging

Add debug logging to server.ts:

```typescript
console.error('DEBUG:', someValue); // stderr won't interfere with stdio
```

### MCP Inspector

Use the MCP Inspector tool to test the server:

```bash
npx @modelcontextprotocol/inspector context-stash --serve
```

## Release Process

1. **Update version** in package.json
2. **Update CHANGELOG.md**
3. **Build**: `npm run build`
4. **Test**: Manual testing
5. **Commit**: `git commit -am "Release v1.x.x"`
6. **Tag**: `git tag v1.x.x`
7. **Push**: `git push && git push --tags`
8. **Publish**: `npm publish`

## Contributing

See CONTRIBUTING.md for contribution guidelines.

## Questions?

Open an issue on GitHub or contact the maintainers.
