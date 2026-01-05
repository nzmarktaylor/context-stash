# Example Usage

This document demonstrates how to use context-stash in a real project.

## Scenario: Bug Fix with Context

Imagine you're fixing a null pointer exception in a user authentication service.

### Step 1: Create Context Entry

The AI agent calls:

```json
Tool: context.create
Input: {
  "markdown": "# Fix: Null Pointer in Authentication\n\nProblem: getUserRole() throws NPE when user object is null.\n\nCause: The middleware doesn't check if authentication succeeded before passing user object.\n\nSolution: Added null check in getUserRole() and return 'guest' role for unauthenticated users.\n\nTested: Added unit tests for null user scenario."
}
```

Response:

```json
{
  "file": "00001.md"
}
```

### Step 2: Reference in Code

The agent adds comments to the modified code:

```typescript
// refer to context 00001
export function getUserRole(user: User | null): string {
  if (!user) {
    return 'guest';
  }
  return user.role || 'user';
}
```

### Step 3: Later Context Retrieval

A few days later, another AI agent (or the same one) sees the comment and retrieves context:

```json
Tool: context.get
Input: {
  "ref": "00001"
}
```

Response:

```json
{
  "markdown": "# Fix: Null Pointer in Authentication\n\nProblem: getUserRole() throws NPE when user object is null.\n\nCause: The middleware doesn't check if authentication succeeded before passing user object.\n\nSolution: Added null check in getUserRole() and return 'guest' role for unauthenticated users.\n\nTested: Added unit tests for null user scenario."
}
```

Now the agent understands WHY the null check exists and won't suggest removing it as "unnecessary".

## Scenario: Design Decision

### Creating Architectural Context

```json
Tool: context.create
Input: {
  "markdown": "# Decision: Use Event-Driven Architecture for Notifications\n\nContext: Initially considered direct HTTP calls between services for notifications.\n\nDecision: Implemented event bus pattern using Redis pub/sub.\n\nRationale:\n- Decouples notification service from user service\n- Allows multiple consumers (email, SMS, push)\n- Better fault tolerance - messages persist if consumer is down\n- Easier to add new notification channels without modifying user service\n\nTrade-offs:\n- Added Redis dependency\n- Slightly higher latency (acceptable for notifications)\n\nAlternatives considered:\n- Direct HTTP: Too tightly coupled\n- Message queue (RabbitMQ): Overkill for current scale"
}
```

Response:

```json
{
  "file": "00002.md"
}
```

### Reference in Multiple Files

```typescript
// services/user-service.ts
// refer to context 00002
async function createUser(data: UserData) {
  const user = await db.users.create(data);
  await eventBus.publish('user.created', { userId: user.id });
  return user;
}
```

```typescript
// services/notification-service.ts
// refer to context 00002
eventBus.subscribe('user.created', async (event) => {
  await sendWelcomeEmail(event.userId);
});
```

## Scenario: Searching Context

### Finding Related Context

```json
Tool: context.search
Input: {
  "query": "authentication"
}
```

Response:

```json
{
  "results": [
    {
      "ref": "00001",
      "file": "00001.md",
      "snippet": "# Fix: Null Pointer in Authentication"
    }
  ]
}
```

### Listing All Context

```json
Tool: context.list
Input: {}
```

Response:

```json
{
  "entries": [
    { "ref": "00001", "file": "00001.md" },
    { "ref": "00002", "file": "00002.md" }
  ]
}
```

## Best Practices Demonstrated

1. **Atomic Entries**: Each context entry covers one specific issue or decision
2. **Clear Titles**: Using markdown headers for easy scanning
3. **Structured Content**: Problem/Solution format for bugs, Context/Decision/Rationale for architecture
4. **Multiple References**: Same context (00002) referenced in two different files
5. **Searchable**: Keywords like "authentication" help find relevant context later

## Anti-Patterns to Avoid

### ❌ Too Vague

```markdown
# Some fixes

Fixed a few bugs and updated the service.
```

### ❌ Too Long

A context entry with 200 lines of detailed implementation notes (exceeds maxLines).

### ❌ Editing Existing Context

Never modify `.context/00001.md` after creation. Instead, create a new entry:

```markdown
# Update to Context 00001: Edge Case Handling

Original fix in 00001 didn't handle empty string usernames.
Added additional check for empty strings in getUserRole().
```

### ✅ Correct Approach

```markdown
# Additional Fix: Handle Empty Username in Authentication
refer to context 00001

Extended the null check to also handle empty string usernames.
Updated unit tests to cover this edge case.
```

## Real-World Workflow

1. **Agent makes a change** → Creates context entry
2. **Agent adds comment** → `// refer to context 00042`
3. **Context committed to Git** → Shared with team
4. **Another agent sees comment** → Retrieves context 00042
5. **Agent understands WHY** → Avoids reintroducing the bug
6. **Team reviews PR** → Context entry explains the reasoning
