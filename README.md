# tai-plugin

Treedis TAI for Claude: a Claude plugin for **customers** who use Claude (the
Claude app, Cowork or Claude Code) with the Treedis MCP server. It bundles the
Treedis connector and four skills. It works next to other plugins, for example
Anthropic's "Claude for Manufacturing".

This is not the internal skills repo. Skills for Treedis staff live in
`treedis/treedis-claude-plugin`.

| Skill                      | For                                | What it does                                                                                                                  |
| -------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `diagnose-breakdown`       | Technicians, reliability engineers | Reads readings, alerts, PLC events, repair history, manuals and safety records; ranks likely causes with evidence and a check |
| `failed-inspection-report` | Quality and safety owners          | Reads the failed inspection, its history, issues and CAPAs; drafts a CAPA report; saves it only after a yes                   |
| `downtime-report`          | Plant managers, shift leads        | Reads asset health, machine states, alerts and work orders; writes one short status and downtime report                       |
| `setup-check`              | Whoever installs it                | Checks the connection and the data each skill needs; says what to add                                                         |

TAI Chat users get breakdown diagnosis inside TAI itself (`get_record` mode
`diagnose` in the `cw` repo).

## Data it sends

- The plugin holds no code that runs on your machine. It has a connector and
  skill text only.
- The connector talks only to the Treedis MCP server at
  `https://mcp.treedis.com/mcp`, over HTTPS, signed in with the user's own
  Treedis account (OAuth). Each call reads or changes data in that user's
  Treedis Workspace, within that user's Treedis permissions.
- What a skill reads (assets, sensor readings, alerts, work orders, manuals,
  safety records) goes into the user's Claude conversation, so Claude can
  answer. A write (a work request or a CAPA) runs only after the user says yes.
- The plugin sends nothing to any other service. Treedis privacy policy:
  https://treedis.com/privacy-policy/

## Files

- `.claude-plugin/marketplace.json`: the marketplace. It lists one plugin,
  `plugins/treedis-tai`.
- `plugins/treedis-tai/`: the plugin itself, the folder the Claude directory
  reads. Only manifest, icon, connector, skills, README and LICENSE go here:
  the directory refuses scripts from an organization that is not Verified.
- `plugins/treedis-tai/.mcp.json`: the Treedis MCP server, `https://mcp.treedis.com/mcp`. The
  user signs in with OAuth on first use.
- `plugins/treedis-tai/skills/<name>/SKILL.md`: the skills. They name MCP tools only by name.
- `mcp-tools.json`: the tool names of the MCP server (`backend/apps/mcp` in
  `treedis/cw`). `scripts/check.mjs` fails when a skill names a tool that is
  not in it. CI runs it on every pull request.

## Rules for changes

- When MCP tools change in `cw`, update `mcp-tools.json` and the skills in the
  same week. A renamed tool breaks a skill silently in the customer's Claude.
- A skill never writes without a yes from the user. Writes go through
  `api_write` after `api_write_schema`.
- Keep each skill short: the tool descriptions already say what each tool
  returns. A skill says the order, the output and the rules.
- Raise `version` in `plugin.json` when a skill changes, or users keep the old
  copy.
- No credentials, tokens or customer data in this repo.

## Try it

In Claude Code:

```
/plugin marketplace add treedis/tai-plugin
/plugin install treedis-tai@treedis
```

Then sign in to the Treedis connector with `/mcp`.

## Publish

- Claude app, Team or Enterprise: an org owner adds it under Organization
  settings > Plugins & skills (sync from GitHub or upload a zip), and also
  adds the Treedis connector under Organization settings > Connectors. Each
  member then signs in with their own Treedis account.
- Claude plugin directory: an owner submits it at
  `https://claude.ai/directory/manage` after
  `claude plugin validate plugins/treedis-tai --strict` passes. Submit the
  folder `plugins/treedis-tai`.
- A customer who runs Treedis in its own AWS account changes the URL in
  `.mcp.json` to its own MCP host.
