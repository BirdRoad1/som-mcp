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

<img width="1429" height="982" alt="image" src="https://github.com/user-attachments/assets/d22128fe-da7b-4d23-b575-895b3552f74c" />

## Installation

Run the following command:

```
npm i -g som-mcp
```

Then, find the folder where Node.js is installed and enter the bin folder. There, you will find both the node and som-mcp executables. You can then copy their full paths to use in your claude config.

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
