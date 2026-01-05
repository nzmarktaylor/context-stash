import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  loadConfig,
  formatFilename,
  extractRef,
  getNextIndex,
  countLines,
  validatePath,
} from './utils.js';
import { ContextEntry, SearchResult } from './types.js';

const CONTEXT_DIR = '.context';
const workspaceRoot = process.cwd();

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'context-stash',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'context.create',
          description: 'Create a new immutable context entry',
          inputSchema: {
            type: 'object',
            properties: {
              markdown: {
                type: 'string',
                description: 'Markdown content for the context entry',
              },
            },
            required: ['markdown'],
          },
        },
        {
          name: 'context.get',
          description: 'Retrieve the contents of a context entry',
          inputSchema: {
            type: 'object',
            properties: {
              ref: {
                type: 'string',
                description: 'Reference number (e.g., "00012")',
              },
            },
            required: ['ref'],
          },
        },
        {
          name: 'context.list',
          description: 'List all context entries',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'context.search',
          description: 'Search context entries by keyword',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query string',
              },
            },
            required: ['query'],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      switch (request.params.name) {
        case 'context.create':
          return await handleCreate(request.params.arguments);
        
        case 'context.get':
          return await handleGet(request.params.arguments);
        
        case 'context.list':
          return await handleList();
        
        case 'context.search':
          return await handleSearch(request.params.arguments);
        
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Handle context.create tool
 */
async function handleCreate(args: any) {
  const { markdown } = args;
  
  if (typeof markdown !== 'string') {
    throw new Error('markdown must be a string');
  }

  // Load config
  const config = await loadConfig(workspaceRoot);

  // Validate line count
  const lineCount = countLines(markdown);
  if (lineCount > config.maxLines) {
    throw new Error(
      `Markdown exceeds maximum of ${config.maxLines} lines (got ${lineCount} lines)`
    );
  }

  // Get next index and format filename
  const index = await getNextIndex(workspaceRoot, config);
  const filename = formatFilename(index, config);
  const filePath = path.join(workspaceRoot, CONTEXT_DIR, filename);

  // Validate path
  validatePath(filePath, workspaceRoot);

  // Write file
  await fs.writeFile(filePath, markdown, 'utf-8');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ file: filename }, null, 2),
      },
    ],
  };
}

/**
 * Handle context.get tool
 */
async function handleGet(args: any) {
  const { ref } = args;
  
  if (typeof ref !== 'string') {
    throw new Error('ref must be a string');
  }

  // Load config
  const config = await loadConfig(workspaceRoot);

  // Determine filename
  const filename = `${config.filePrefix}${ref}${config.fileSuffix}`;
  const filePath = path.join(workspaceRoot, CONTEXT_DIR, filename);

  // Validate path
  validatePath(filePath, workspaceRoot);

  // Read file
  try {
    const markdown = await fs.readFile(filePath, 'utf-8');
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ markdown }, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Context entry '${ref}' not found`);
  }
}

/**
 * Handle context.list tool
 */
async function handleList() {
  // Load config
  const config = await loadConfig(workspaceRoot);

  const contextDir = path.join(workspaceRoot, CONTEXT_DIR);
  
  try {
    const files = await fs.readdir(contextDir);
    const entries: ContextEntry[] = [];

    for (const file of files) {
      if (file === 'config.json') continue;

      const ref = extractRef(file, config);
      if (ref) {
        entries.push({ ref, file });
      }
    }

    // Sort by index
    entries.sort((a, b) => {
      const indexA = parseInt(a.ref, 10);
      const indexB = parseInt(b.ref, 10);
      return indexA - indexB;
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ entries }, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error('Failed to list context entries');
  }
}

/**
 * Handle context.search tool
 */
async function handleSearch(args: any) {
  const { query } = args;
  
  if (typeof query !== 'string') {
    throw new Error('query must be a string');
  }

  // Load config
  const config = await loadConfig(workspaceRoot);

  const contextDir = path.join(workspaceRoot, CONTEXT_DIR);
  const results: SearchResult[] = [];

  try {
    const files = await fs.readdir(contextDir);

    for (const file of files) {
      if (file === 'config.json') continue;

      const ref = extractRef(file, config);
      if (!ref) continue;

      const filePath = path.join(contextDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Simple case-insensitive search
      const lines = content.split('\n');
      const lowerQuery = query.toLowerCase();

      for (const line of lines) {
        if (line.toLowerCase().includes(lowerQuery)) {
          results.push({
            ref,
            file,
            snippet: line.trim(),
          });
          break; // Only include first match per file
        }
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ results }, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error('Failed to search context entries');
  }
}

/**
 * Start the MCP server
 */
export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Keep process running
  process.stdin.resume();
}
