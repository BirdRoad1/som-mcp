import { Tool } from '../tool';

export const register: Tool = server => {
  server.registerTool(
    'getUsersCount',
    {
      description:
        'Get the number of users in the Summer of Code API unofficial database'
    },
    async () => {
      try {
        const res = await fetch(`https://som.jlmsz.com/api/users/count`);

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

        return {
          content: [
            {
              type: 'text',
              text: await res.text()
            }
          ]
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
