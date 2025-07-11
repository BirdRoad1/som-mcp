#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'path';
import fs from 'fs';

(async () => {
  const __dirname = path.dirname(__filename);

  const server = new McpServer({
    name: 'som-mcp',
    version: '1.0.0'
  });

  const toolsDir = path.join(__dirname, 'tools');

  for (const tool of fs.readdirSync(toolsDir)) {
    if (tool.endsWith('.d.ts')) continue;

    const toolFile = path.join(toolsDir, tool);
    try {
      const imported = await import(toolFile);
      const registerFunc = imported?.register;
      if (!registerFunc) {
        console.log('Tool has no register():', tool);
        continue;
      }

      registerFunc(server);
    } catch (err) {
      console.log('Failed to register tool:', toolFile, err);
    }
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
