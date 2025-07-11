# SoM-MCP

This MCP server can be used to query data from the Summer of Making unofficial API available at https://som.jlmsz.com/.

Supported tools:

- Clone a project's repository
- Get project content
- Get project count
- Get users count
- Request scrape
- Search for projects
- Search for users

## Troubleshooting

If the MCP server fails to load, make sure to use an absolute path to the Node.js binary in your config.
Example claude_desktop_config.json:

```json
{
  "mcpServers": {
    "som-mcp": {
      "command": "/home/user/nodejs/bin/node",
      "args": ["/home/user/nodejs/bin/som-mcp"]
    }
  }
} 

```
