<p align="center"><img src=".claude-plugin/icon.png" alt="TAI" width="120"></p>

# Treedis AI (TAI) for Claude

The Treedis Connected Workers connector and four skills for maintenance, quality and plant reports.

| Skill                      | For                                | What it does                                                                                                                  |
| -------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `diagnose-breakdown`       | Technicians, reliability engineers | Reads readings, alerts, PLC events, repair history, manuals and safety records; ranks likely causes with evidence and a check |
| `failed-inspection-report` | Quality and safety owners          | Reads the failed inspection, its history, issues and CAPAs; drafts a CAPA report; saves it only after a yes                   |
| `downtime-report`          | Plant managers, shift leads        | Reads asset health, machine states, alerts and work orders; writes one short status and downtime report                       |
| `setup-check`              | Whoever installs it                | Checks the connection and the data each skill needs; says what to add                                                         |

## Data it sends

- The plugin holds no code that runs on your machine. It has a connector and
  skill text only.
- The connector talks only to the Treedis MCP server at
  `https://treedis.com/mcp`, over HTTPS, signed in with the user's own
  Treedis account (OAuth). Each call reads or changes data in that user's
  Treedis Workspace, within that user's Treedis permissions.
- What a skill reads (assets, sensor readings, alerts, work orders, manuals,
  safety records) goes into the user's Claude conversation, so Claude can
  answer. A write (a work request or a CAPA) runs only after the user says yes.
- The plugin sends nothing to any other service. Treedis privacy policy:
  https://treedis.com/privacy-policy/

## Install

```
/plugin marketplace add treedis/tai-plugin
/plugin install treedis-tai@treedis
```

Then sign in to the Treedis connector with `/mcp`, using your Treedis account.
