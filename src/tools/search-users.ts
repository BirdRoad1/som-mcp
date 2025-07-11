import { Tool } from '../types/tool.js';
import z from 'zod';
import { User } from '../types/som-types.js';

export const register: Tool = server => {
  server.registerTool(
    'searchUsers',
    {
      inputSchema: {
        nameOrSlackId: z.string().min(1).optional(),
        limit: z.number().int().min(1).max(200),
        sort: z.enum(['mins', 'devlogs', 'random'])
      },
      description: 'Fetch a user from the Summer of Code data unofficial API'
    },
    async ({ limit, sort, nameOrSlackId }) => {
      try {
        const params = new URLSearchParams({
          sort,
          limit: limit.toString()
        });

        if (nameOrSlackId) {
          params.set('name', nameOrSlackId);
        }

        const res = await fetch(
          `https://som.jlmsz.com/api/users?${params.toString()}`
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
        const json: User[] = await res.json();
        return {
          content: json.map(user => ({
            type: 'text',
            text: `Name: ${user.name}, Slack ID: ${user.slackId}, ${user.devlogs} devlogs, ${user.minutes} minutes spent coding`
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
