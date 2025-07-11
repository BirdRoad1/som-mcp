import { Tool } from '../types/tool.js';
import z from 'zod';
import { Project } from '../types/som-types.js';

export const register: Tool = server => {
  server.registerTool(
    'searchProjects',
    {
      inputSchema: {
        name: z.string().min(1).optional(),
        authorNameOrSlackId: z.string().min(1).optional(),
        limit: z.number().int().min(1).max(200),
        sort: z.enum(['mins', 'devlogs', 'url', 'random'])
      },
      description:
        'Search for projects from the Summer of Code data unofficial API'
    },
    async ({ limit, sort, authorNameOrSlackId, name }) => {
      try {
        const params = new URLSearchParams({
          sort,
          limit: limit.toString()
        });

        if (authorNameOrSlackId) {
          params.append('author', authorNameOrSlackId);
        }
        if (name) {
          params.append('name', name);
        }

        const res = await fetch(
          `https://som.jlmsz.com/api/projects?${params.toString()}`
        );

        if (!res.ok) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: A bad HTTP response code was returned ${res.status}`
              }
            ]
          };
        }
        const json: Project[] = await res.json();
        return {
          content: json.map(project => ({
            type: 'text',
            text: JSON.stringify(project)
          }))
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: 'text',
              text: 'Error: ' + message
            }
          ]
        };
      }
    }
  );
};
