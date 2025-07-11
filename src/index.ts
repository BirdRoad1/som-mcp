#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'path';
import fs from 'fs';

const __dirname = import.meta.dirname;

const server = new McpServer({
  name: 'mcp-weather-server',
  version: '1.0.0'
});

const toolsDir = path.join(__dirname, 'tools');

for (const tool of fs.readdirSync(toolsDir)) {
  const toolFile = path.join(toolsDir, tool);
  try {
    const imported = await import(toolFile);
    const registerFunc = imported?.register;
    if (!registerFunc) {
      console.log('Tool has no register():', tool);
      continue;
    }

    registerFunc(server);
    console.log('Registered tool file:', tool);
  } catch (err) {
    console.log('Failed to register tool:', toolFile, err);
  }
}

const transport = new StdioServerTransport();
await server.connect(transport);
