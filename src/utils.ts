import { promises as fs } from 'fs';
import * as path from 'path';
import { Config, DEFAULT_CONFIG, AGENTS_MD_CONTENT } from './types.js';

const CONTEXT_DIR = '.context';
const CONFIG_FILE = 'config.json';
const AGENTS_FILE = 'agents.md';

/**
 * Load configuration from .context/config.json
 */
export async function loadConfig(workspaceRoot: string): Promise<Config> {
  const configPath = path.join(workspaceRoot, CONTEXT_DIR, CONFIG_FILE);
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    throw new Error(`Failed to load config. Run 'context-stash --init' first.`);
  }
}

/**
 * Save configuration to .context/config.json
 */
export async function saveConfig(workspaceRoot: string, config: Config): Promise<void> {
  const configPath = path.join(workspaceRoot, CONTEXT_DIR, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Initialize the context-stash workspace
 */
export async function initializeWorkspace(workspaceRoot: string): Promise<void> {
  const contextDir = path.join(workspaceRoot, CONTEXT_DIR);
  
  // Create .context directory
  try {
    await fs.mkdir(contextDir, { recursive: true });
    console.log(`✓ Created ${CONTEXT_DIR}/ directory`);
  } catch (error) {
    console.log(`✓ ${CONTEXT_DIR}/ directory already exists`);
  }
  
  // Create or update config.json
  const configPath = path.join(contextDir, CONFIG_FILE);
  try {
    await fs.access(configPath);
    console.log(`✓ ${CONTEXT_DIR}/${CONFIG_FILE} already exists`);
  } catch {
    await saveConfig(workspaceRoot, DEFAULT_CONFIG);
    console.log(`✓ Created ${CONTEXT_DIR}/${CONFIG_FILE}`);
  }
  
  // Create or update agents.md
  const agentsPath = path.join(workspaceRoot, AGENTS_FILE);
  try {
    await fs.access(agentsPath);
    console.log(`✓ ${AGENTS_FILE} already exists`);
  } catch {
    await fs.writeFile(agentsPath, AGENTS_MD_CONTENT, 'utf-8');
    console.log(`✓ Created ${AGENTS_FILE}`);
  }
  
  console.log('\n✓ Initialization complete!');
  console.log(`\nTo use the MCP server, run:`);
  console.log(`  context-stash --serve`);
}

/**
 * Format index as filename according to config
 */
export function formatFilename(index: number, config: Config): string {
  const paddedIndex = String(index).padStart(config.leadingZeros, '0');
  return `${config.filePrefix}${paddedIndex}${config.fileSuffix}`;
}

/**
 * Extract reference number from filename
 */
export function extractRef(filename: string, config: Config): string | null {
  const { filePrefix, fileSuffix } = config;
  
  if (!filename.startsWith(filePrefix) || !filename.endsWith(fileSuffix)) {
    return null;
  }
  
  const start = filePrefix.length;
  const end = filename.length - fileSuffix.length;
  return filename.substring(start, end);
}

/**
 * Get the next available index
 */
export async function getNextIndex(workspaceRoot: string, config: Config): Promise<number> {
  const contextDir = path.join(workspaceRoot, CONTEXT_DIR);
  
  try {
    const files = await fs.readdir(contextDir);
    const indices: number[] = [];
    
    for (const file of files) {
      if (file === CONFIG_FILE) continue;
      
      const ref = extractRef(file, config);
      if (ref) {
        const index = parseInt(ref, 10);
        if (!isNaN(index)) {
          indices.push(index);
        }
      }
    }
    
    if (indices.length === 0) {
      return config.startIndex;
    }
    
    return Math.max(...indices) + 1;
  } catch (error) {
    return config.startIndex;
  }
}

/**
 * Count lines in markdown content
 */
export function countLines(markdown: string): number {
  return markdown.split('\n').length;
}

/**
 * Validate path to prevent directory traversal
 */
export function validatePath(requestedPath: string, workspaceRoot: string): void {
  const normalized = path.normalize(requestedPath);
  const resolved = path.resolve(workspaceRoot, normalized);
  
  if (!resolved.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
}
