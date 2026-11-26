---
name: setup-check
description: Check that the Treedis Connected Workers connection is ready and show which Treedis skills can run on this Workspace. Use when someone installs the Treedis plugin, says "set us up", asks what Treedis can do here, or a Treedis skill cannot find data.
---

# Setup check

The goal: tell the user which Treedis skills can run now, and what to add for
the others.

## 1. Check the connection

Call `workspace_setup_get`. If it fails with a sign-in or permission error,
tell the user to connect the Treedis connector again and sign in with a
Treedis account of the Workspace. Stop there.

## 2. Check the data each skill needs

| Data                   | Call                                                                                                      | Needed by                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Assets                 | `asset_list`                                                                                              | all skills                                      |
| Live sensor data       | `workspace_setup_get` (`dataSources`), `machine_state_list`                                               | diagnose-breakdown, downtime-report             |
| Alerts                 | `alert_list` with `view` `active`                                                                         | diagnose-breakdown, downtime-report             |
| Work orders            | `work_order_list` with `group_by` `status`                                                                | all skills                                      |
| Manuals and procedures | `tai_coverage_get` (library files read, files not linked to an asset); `knowledge_search` without `query` | diagnose-breakdown, failed-inspection-report    |
| Inspections and CAPAs  | `safety_list` with `kind` `inspections`, then `kind` `capas`                                              | failed-inspection-report                        |
| Asset links            | `graph_get` with `view` `network`                                                                         | diagnose-breakdown (upstream causes, isolation) |

A tool that is not listed means the Workspace policy does not open its
section. Say which section is closed; a Workspace admin can open it.

## 3. Report

Give a table: skill, ready (yes, partly, no), and what is missing. Then give
the one change that opens the most, for example "link the pump manuals to the
pumps" or "connect the sensor data source".

Answer in the language of the user's latest message.
