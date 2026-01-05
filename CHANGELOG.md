# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-05

### Added
- Initial release of context-stash
- MCP server with stdio transport
- Four core tools:
  - `context.create` - Create immutable context entries
  - `context.get` - Retrieve context by reference
  - `context.list` - List all context entries
  - `context.search` - Search context by keyword
- CLI commands:
  - `--init` - Initialize workspace
  - `--serve` - Start MCP server
  - `--help` - Show help
- Configuration system via `.context/config.json`
- Automatic `agents.md` generation
- Path traversal protection
- Line count validation
- TypeScript support with full type definitions
- Comprehensive documentation and examples

### Security
- Sandboxed to workspace root directory
- Path validation to prevent directory traversal
- No network access required

[1.0.0]: https://github.com/yourusername/context-stash/releases/tag/v1.0.0
