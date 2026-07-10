import { createRequire } from "node:module";
import { extractSSEDataMessages } from "../src/proxy.js";

const require = createRequire(import.meta.url);
const packageMetadata = require("../package.json");
const endpoint = (
  process.env.COLD_AGENT_MCP_URL || "https://getcoldagent.com/api/mcp"
).trim();
const apiKey = (process.env.COLD_AGENT_API_KEY || "").trim();
const protocolVersion = "2025-11-25";

const requiredTools = [
  "ask_cold_agent",
  "get_workspace_summary",
  "list_campaigns",
  "get_campaign",
  "get_deliverability_status",
  "add_sending_domain",
  "check_domain_verification",
  "create_sender_email",
  "assign_campaign_sender",
  "prepare_domain_sender",
  "run_seed_test",
  "sync_smartlead_warmup",
  "enable_smartlead_warmup",
  "disable_smartlead_warmup",
  "enroll_smartlead_sender",
  "prepare_smartlead_sender",
  "prepare_ses_sender",
  "create_campaign_draft",
  "source_leads",
  "verify_lead",
  "setup_inbound_leads",
  "setup_ad_spend",
  "setup_voip",
  "get_voice_setup",
  "configure_voice_settings",
  "search_voice_numbers",
  "purchase_voice_number",
  "list_lead_workspace",
  "assign_leads",
  "list_lead_activities",
  "log_lead_activity",
  "start_voip_call",
  "pause_campaign",
  "resume_campaign",
  "launch_campaign",
];

if (!apiKey) {
  throw new Error(
    "COLD_AGENT_API_KEY is required for the hosted MCP contract check",
  );
}

const initialized = await callMCP("initialize", {
  protocolVersion,
  capabilities: {},
  clientInfo: {
    name: "cold-agent-mcp-contract-check",
    version: packageMetadata.version,
  },
});
if (initialized.protocolVersion !== protocolVersion) {
  throw new Error(
    `hosted MCP protocol is ${initialized.protocolVersion}; expected ${protocolVersion}`,
  );
}

const listed = await callMCP("tools/list", {});
const availableTools = new Set(
  Array.isArray(listed.tools) ? listed.tools.map((tool) => tool.name) : [],
);
const missingTools = requiredTools.filter((name) => !availableTools.has(name));
if (missingTools.length > 0) {
  throw new Error(`hosted MCP is missing tools: ${missingTools.join(", ")}`);
}

console.log(
  `Verified ${availableTools.size} hosted Cold Agent MCP tools at ${endpoint}.`,
);

async function callMCP(method, params) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "MCP-Protocol-Version": protocolVersion,
        "Mcp-Method": method,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: method,
        method,
        params,
      }),
      signal: controller.signal,
    });
    const body = await response.text();
    if (!response.ok) {
      throw new Error(`hosted MCP returned HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    const messages = contentType.toLowerCase().includes("text/event-stream")
      ? extractSSEDataMessages(body)
      : [body];
    const payloads = messages.map((message) => JSON.parse(message));
    const payload =
      payloads.find((message) => message?.id === method) || payloads[0];
    if (!payload) {
      throw new Error(`hosted MCP ${method} returned an empty response`);
    }
    if (payload.error) {
      throw new Error(payload.error.message || `hosted MCP ${method} failed`);
    }
    return payload.result || {};
  } finally {
    clearTimeout(timeout);
  }
}
