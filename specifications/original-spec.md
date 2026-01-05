# **Context‑Stash: Specification Document (NodeJS MCP Server)**

## **1. Overview**
**context‑stash** is a lightweight, workspace‑scoped MCP server that provides a durable, Git‑native memory layer for AI coding agents. It stores atomic context entries as Markdown files inside a `.context/` directory at the root of a project. AI agents reference these entries in code comments (e.g., `// refer to context 00012`) to preserve reasoning and avoid reintroducing historical bugs.

The MCP server is launched **per workspace** (via stdio), not globally, and is sandboxed to the workspace root.

---

# **2. Directory Structure**

```
<workspace-root>/
  .context/
    config.json
    00001.md
    00002.md
    ...
  agents.md
```

---

# **3. Initialization Behavior (`context-stash --init`)**

Running:

```bash
context-stash --init
```

Performs the following:

### **3.1 Create `.context/` directory**
If missing, create:

```
.context/
```

### **3.2 Create or update `.context/config.json`**
Default config:

```json
{
  "maxLines": 50,
  "startIndex": 1,
  "leadingZeros": 5,
  "filePrefix": "",
  "fileSuffix": ".md"
}
```

### **3.3 Create or update `agents.md`**
Append or create the following content:

---

## **Suggested `agents.md` Content**

```md
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
```

---

# **4. MCP Server Specification**

The MCP server runs via:

```bash
context-stash --serve
```

Communication is via **stdio**, not TCP.

All file operations must be restricted to `process.cwd()`.

---

# **5. MCP Tools**

## **5.1 `context.create`**

### **Purpose**
Create a new immutable context entry.

### **Input**
```json
{
  "markdown": "string"
}
```

### **Behavior**
1. Load `.context/config.json`.
2. Validate that the markdown does not exceed `maxLines`.
3. Determine next index:
   - Start from `startIndex`
   - Use `leadingZeros` to format filename
   - Example: index 12 → `"00012.md"`
4. Write file to `.context/<filename>`.
5. Return the filename (without path).

### **Output**
```json
{
  "file": "00012.md"
}
```

### **Notes**
- Context entries are **immutable**.
- If markdown exceeds `maxLines`, return an error.

---

## **5.2 `context.get`**

### **Purpose**
Retrieve the contents of a context entry.

### **Input**
```json
{
  "ref": "string"   // e.g., "00012"
}
```

### **Behavior**
1. Map `ref` to filename using config:
   - prefix + ref + suffix
2. Read `.context/<filename>`.
3. Return markdown contents.

### **Output**
```json
{
  "markdown": "string"
}
```

---

## **5.3 `context.list`**

### **Purpose**
List all context entries.

### **Input**
None.

### **Behavior**
1. Scan `.context/` for files matching the configured pattern.
2. Sort numerically by index.

### **Output**
```json
{
  "entries": [
    { "ref": "00001", "file": "00001.md" },
    { "ref": "00002", "file": "00002.md" }
  ]
}
```

---

## **5.4 `context.search` (initial version)**

### **Purpose**
Simple keyword search across context entries.

### **Input**
```json
{
  "query": "string"
}
```

### **Behavior**
1. Search all `.md` files for the query string.
2. Return matching entries.

### **Output**
```json
{
  "results": [
    {
      "ref": "00012",
      "file": "00012.md",
      "snippet": "line containing the match..."
    }
  ]
}
```

### **Future expansion**
- Optional embeddings
- Semantic search
- Ranking

---

# **6. Context Rules (for AI agents)**

### **6.1 Context entries are immutable**
- Never modify an existing `.md` file.
- If new reasoning is needed, call `context.create` again.

### **6.2 Multiple references allowed**
- A single context entry may be referenced in many files.
- A single code location may reference multiple entries.

### **6.3 Keep entries concise**
- Max lines = `config.maxLines` (default 50).
- Encourage short, atomic reasoning.

### **6.4 One context entry per conceptual change**
If a change affects multiple files, they all reference the same context entry.

---

# **7. Configuration (`.context/config.json`)**

### **Default**
```json
{
  "maxLines": 50,
  "startIndex": 1,
  "leadingZeros": 5,
  "filePrefix": "",
  "fileSuffix": ".md"
}
```

### **Fields**

| Field | Description |
|-------|-------------|
| `maxLines` | Maximum allowed lines in a context entry |
| `startIndex` | First index to use (e.g., 1000 for legacy repos) |
| `leadingZeros` | Number of digits in filenames |
| `filePrefix` | Optional prefix (e.g., `"ctx-"`) |
| `fileSuffix` | Optional suffix (e.g., `".markdown"`) |

### **Filename Format**
```
<filePrefix><index padded with leadingZeros><fileSuffix>
```

Example:

```
ctx-00123.markdown
```

---

# **8. Error Handling**

### **Common errors**
- Missing `.context/` directory → instruct user to run `context-stash --init`
- Markdown exceeds `maxLines`
- Invalid reference number
- File not found
- Config file missing or malformed

Errors should be returned as structured MCP errors.

---

# **9. Implementation Notes for Codex / GitHub Copilot**

- Use NodeJS + TypeScript.
- Use stdio for MCP communication.
- Use `fs/promises` for file operations.
- Use a small internal helper to format filenames.
- Ensure all paths are resolved relative to `process.cwd()`.
- Never allow path traversal (`../`).

---

