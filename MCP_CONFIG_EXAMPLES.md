# Example MCP Server Configurations

## Claude Desktop (macOS)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

## Claude Desktop (Windows)

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context-stash": {
      "command": "context-stash",
      "args": ["--serve"],
      "cwd": "C:\\path\\to\\your\\project"
    }
  }
}
```

## VS Code with GitHub Copilot

Add to `.vscode/settings.json` in your project:

```json
{
  "github.copilot.chat.mcpServers": {
    "context-stash": {
      "command": "context-stash",
      "args": ["--serve"]
    }
  }
}
```

Note: The `cwd` is automatically set to the workspace root in VS Code.

## Cline Extension

Add to Cline's MCP settings:

```json
{
  "mcpServers": {
    "context-stash": {
      "command": "context-stash",
      "args": ["--serve"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

## Using npx (Alternative)

If you haven't installed globally, you can use npx:

```json
{
  "mcpServers": {
    "context-stash": {
      "command": "npx",
      "args": ["context-stash", "--serve"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

## Local Installation

If installed locally in a project (not globally):

```json
{
  "mcpServers": {
    "context-stash": {
      "command": "node",
      "args": ["node_modules/context-stash/dist/cli.js", "--serve"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

## Important Notes

1. **Working Directory**: Always set `cwd` to your project root where `.context/` lives
2. **Run --init First**: Before configuring the MCP server, run `context-stash --init` in your project
3. **Restart Agent**: After adding the MCP server config, restart your AI agent application
4. **Path Format**: Use forward slashes `/` even on Windows, or escape backslashes `\\`
