// Checks the plugin before a merge: the manifest and marketplace agree, the
// connector points at the public MCP server, every skill names itself as its
// folder, and every tool a skill names is in mcp-tools.json.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PUBLIC_MCP_URL = 'https://mcp.treedis.com/mcp';
// A backticked word that ends like a tool name: `asset_list`, `api_write_schema`.
// Argument names (`asset_row_id`, `group_by`) end otherwise and are skipped.
const TOOL_REFERENCE = /`([a-z]+(?:_[a-z]+)*_(?:list|get|search|write|schema|ask))`/g;
const MIN_DESCRIPTION = 40;

const json = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const PLUGIN = 'plugins/treedis-tai';
const problems = [];

const plugin = json(`${PLUGIN}/.claude-plugin/plugin.json`);
const marketplace = json('.claude-plugin/marketplace.json');
const names = marketplace.plugins.map((entry) => entry.name);
if (names.length !== 1 || names[0] !== plugin.name)
  problems.push(`marketplace lists ${names.join(', ')}, plugin is ${plugin.name}`);

const server = json(`${PLUGIN}/.mcp.json`).mcpServers?.treedis;
if (server?.type !== 'http' || server?.url !== PUBLIC_MCP_URL)
  problems.push(`.mcp.json treedis must be http ${PUBLIC_MCP_URL}`);

const tools = new Set(json('mcp-tools.json'));
const skillsDir = join(ROOT, PLUGIN, 'skills');
for (const folder of readdirSync(skillsDir)) {
  const text = readFileSync(join(skillsDir, folder, 'SKILL.md'), 'utf8');
  const name = /^---\nname: ([a-z0-9-]+)\n/.exec(text)?.[1];
  if (name !== folder) problems.push(`${folder}: frontmatter name is ${name}`);
  const description = /\ndescription: (.*)\n/.exec(text)?.[1] ?? '';
  if (description.length < MIN_DESCRIPTION)
    problems.push(`${folder}: description too short`);
  const named = [...text.matchAll(TOOL_REFERENCE)].map((match) => match[1]);
  if (named.length === 0) problems.push(`${folder}: names no tool`);
  for (const tool of named.filter((tool) => !tools.has(tool)))
    problems.push(`${folder}: ${tool} is not an MCP tool (mcp-tools.json)`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`ok: ${readdirSync(skillsDir).length} skills, ${tools.size} MCP tools`);
