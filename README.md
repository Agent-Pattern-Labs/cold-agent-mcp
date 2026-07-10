# Cold Agent MCP

Stdio bridge for the hosted [Cold Agent](https://getcoldagent.com) MCP server.

Cold Agent's canonical MCP endpoint is:

```text
https://getcoldagent.com/api/mcp
```

Use this package when your MCP client prefers a local stdio command instead of a remote Streamable HTTP server.

The bridge discovers tools from the hosted server at runtime. New Cold Agent
tools become available without duplicating business logic in this package.

## Requirements

- Node.js 18 or newer
- A paid or trialing Cold Agent workspace
- A Cold Agent API key from [Settings > API Keys](https://getcoldagent.com/settings/api-keys)

## Recommended: Direct Hosted Connection

Clients with Streamable HTTP support can connect directly and skip the local
bridge. For Codex, keep the token in an environment variable and run:

```bash
export COLD_AGENT_API_KEY=YOUR_COLD_AGENT_API_KEY
codex mcp add cold-agent \
  --url https://getcoldagent.com/api/mcp \
  --bearer-token-env-var COLD_AGENT_API_KEY
```

The stdio package remains useful for clients that only support local commands.

## Stdio Bridge Install

Replace `YOUR_COLD_AGENT_API_KEY` with a key from [Cold Agent Settings > API Keys](https://getcoldagent.com/settings/api-keys).

<details open>
<summary>Claude Code</summary>

**One-line install:**

```bash
claude mcp add -e COLD_AGENT_API_KEY=YOUR_COLD_AGENT_API_KEY cold-agent -- npx -y @agent-pattern-labs/cold-agent-mcp
```

**Uninstall:**

```bash
claude mcp remove cold-agent
```

Or manually add to `.mcp.json` (project-level) or `~/.claude/settings.json` (global):

```json
{
  "mcpServers": {
    "cold-agent": {
      "command": "npx",
      "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
      "env": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall manually, remove the `cold-agent` entry from the config file.

</details>

<details>
<summary>Claude Desktop</summary>

Add to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "cold-agent": {
      "command": "npx",
      "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
      "env": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall, remove the `cold-agent` entry from the config file.

</details>

<details>
<summary>OpenAI Codex</summary>

**One-line install:**

```bash
codex mcp add cold-agent --env COLD_AGENT_API_KEY=YOUR_COLD_AGENT_API_KEY -- npx -y @agent-pattern-labs/cold-agent-mcp
```

**Uninstall:**

```bash
codex mcp remove cold-agent
```

Or manually add to `~/.codex/config.toml`:

```toml
[mcp_servers.cold-agent]
command = "npx"
args = ["-y", "@agent-pattern-labs/cold-agent-mcp"]

[mcp_servers.cold-agent.env]
COLD_AGENT_API_KEY = "YOUR_COLD_AGENT_API_KEY"
```

To uninstall manually, remove the `[mcp_servers.cold-agent]` entry from the config file.

</details>

<details>
<summary>OpenCode</summary>

Add to `opencode.json` in your project root or `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "cold-agent": {
      "type": "local",
      "command": ["npx", "-y", "@agent-pattern-labs/cold-agent-mcp"],
      "enabled": true,
      "environment": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall, remove the `cold-agent` entry from `mcp`.

</details>

<details>
<summary>Cursor</summary>

Open Settings -> MCP -> Add new MCP server, or add to `~/.cursor/mcp.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cold-agent": {
      "command": "npx",
      "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
      "env": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall, remove the entry from MCP settings.

</details>

<details>
<summary>Windsurf</summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "cold-agent": {
      "command": "npx",
      "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
      "env": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall, remove the entry from the config file.

</details>

<details>
<summary>VS Code / Copilot</summary>

**One-line install:**

```bash
code --add-mcp '{"name":"cold-agent","command":"npx","args":["-y","@agent-pattern-labs/cold-agent-mcp"],"env":{"COLD_AGENT_API_KEY":"YOUR_COLD_AGENT_API_KEY"}}'
```

Or add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "cold-agent": {
      "command": "npx",
      "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
      "env": {
        "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

To uninstall, remove the entry from MCP settings or delete the server from the MCP panel.

</details>

<details>
<summary>Other MCP clients</summary>

Any MCP client that supports stdio transport can use Cold Agent. The server config is:

```json
{
  "command": "npx",
  "args": ["-y", "@agent-pattern-labs/cold-agent-mcp"],
  "env": {
    "COLD_AGENT_API_KEY": "YOUR_COLD_AGENT_API_KEY"
  }
}
```

To uninstall, remove the server entry from your client's MCP configuration.

</details>

## Environment Variables

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `COLD_AGENT_API_KEY` | Yes | | Cold Agent API key. |
| `COLD_AGENT_MCP_URL` | No | `https://getcoldagent.com/api/mcp` | Hosted MCP endpoint override. |
| `COLD_AGENT_MCP_TIMEOUT_MS` | No | `60000` | Per-request timeout. |
| `COLD_AGENT_MCP_PROTOCOL_VERSION` | No | `2025-11-25` | MCP protocol version header override. |

## Current Hosted Capabilities

The hosted server currently exposes 35 tenant-scoped tools. They are discovered
dynamically by this bridge and cover:

- natural-language guidance through `ask_cold_agent`, which returns recommendations and proposed actions without executing them
- workspace, campaign, sender, domain, deliverability, reply, and meeting context
- sending-domain verification and sender preparation for SES and Smartlead
- Gmail and Outlook placement seed tests plus Smartlead warmup controls
- campaign drafting, launch, pause, and resume operations with existing approval and deliverability gates
- lead sourcing, verification, Lead Desk assignment/activity workflows, and integration setup
- managed Twilio number search, purchase confirmation, voice settings, and click-to-call

Google Workspace and Microsoft 365 mailbox authorization still happens in the
Cold Agent Domains UI because provider approval is interactive. Once connected,
reply/NDR monitoring and token maintenance run automatically in the hosted app;
they are not separate local proxy features.

## Package Scope Migration

`@agent-pattern-labs/cold-agent-mcp` replaces the legacy
`@razroo/cold-agent-mcp` package. Update existing stdio client configurations to
the new package name. The hosted endpoint and `COLD_AGENT_API_KEY` remain the
same.

## Phone And Voice Tools

The hosted Cold Agent MCP server includes native phone workflow tools:

- `get_voice_setup` — view voice settings and managed Twilio numbers.
- `configure_voice_settings` — set callback phone, provider, caller ID, and call logging.
- `search_voice_numbers` — find available managed Twilio numbers with pricing.
- `purchase_voice_number` — buy a managed Twilio number after explicit confirmation.
- `start_voip_call` — start a Lead Desk click-to-call. With Twilio configured, Cold Agent calls your callback phone first, then bridges to the lead from the managed caller ID.
- `setup_voip` — create a webhook API key for external call event ingestion.

## Remote MCP Config

If your client supports hosted Streamable HTTP servers with headers, you can skip this package:

```json
{
  "mcpServers": {
    "cold-agent": {
      "url": "https://getcoldagent.com/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_COLD_AGENT_API_KEY"
      }
    }
  }
}
```

## What This Package Does

This package is intentionally thin:

- reads JSON-RPC messages from stdio
- forwards them to `https://getcoldagent.com/api/mcp`
- attaches your Cold Agent API key as a bearer token
- writes MCP responses back to stdio

It does not contain Cold Agent business logic and does not store credentials.

## Development

```bash
npm test
```

With a dedicated paid/trialing workspace API key, verify the current hosted
read-only protocol and tool catalog contract:

```bash
COLD_AGENT_API_KEY=YOUR_COLD_AGENT_API_KEY npm run test:hosted
```

## Publishing

The GitHub Actions publish workflow expects an `NPM_TOKEN` Actions secret with
publish access to the `@agent-pattern-labs` npm scope.
An optional `COLD_AGENT_CONTRACT_API_KEY` secret enables a read-only hosted
`initialize` and `tools/list` contract check in CI and before publishing.

Dry-run from the GitHub CLI:

```bash
gh workflow run publish.yml --ref main -f dry_run=true -f tag=latest
```

Publish the version in `package.json`:

```bash
gh workflow run publish.yml --ref main \
  -f dry_run=false \
  -f tag=latest
```

<!-- mcp-name: io.github.Agent-Pattern-Labs/cold-agent-mcp -->
