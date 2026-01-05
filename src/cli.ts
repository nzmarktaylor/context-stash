#!/usr/bin/env node

import { initializeWorkspace } from './utils.js';
import { startServer } from './server.js';

const args = process.argv.slice(2);

// refer to context 00001
async function main() {
  if (args.includes('--init')) {
    // Initialize workspace
    const workspaceRoot = process.cwd();
    await initializeWorkspace(workspaceRoot);
  } else if (args.includes('--serve')) {
    // Start MCP server
    await startServer();
  } else if (args.includes('--help') || args.includes('-h')) {
    // Show help
    console.log(`
context-stash - A workspace-scoped MCP server for AI coding agents

USAGE:
  context-stash --init     Initialize workspace with .context/ directory
  context-stash --serve    Start the MCP server (stdio transport)
  context-stash --help     Show this help message

DESCRIPTION:
  context-stash provides a durable, Git-native memory layer for AI coding
  agents. It stores atomic context entries as Markdown files inside a
  .context/ directory at the root of your project.

INITIALIZATION:
  Run 'context-stash --init' in your project root to create:
    - .context/            Directory for context entries
    - .context/config.json Configuration file
    - agents.md            Usage instructions for AI agents

MCP SERVER:
  The MCP server provides four tools:
    - context.create       Create a new context entry
    - context.get          Retrieve a context entry by reference
    - context.list         List all context entries
    - context.search       Search context entries by keyword

  The server must be launched with the workspace root as the working directory.

EXAMPLES:
  # Initialize a new workspace
  cd /path/to/your/project
  context-stash --init

  # Start the MCP server (typically configured in your AI agent)
  context-stash --serve

MORE INFO:
  https://github.com/yourusername/context-stash
`);
  } else {
    console.error('Unknown command. Use --help for usage information.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
