import { Tool } from '../tool';

export const register: Tool = server => {
  server.registerTool(
    'requestScrape',
    {
      inputSchema: {},
      description:
        'Request a re-scrape from the Summer of Code data unofficial API.'
    },
    async () => {
      try {
        const res = await fetch(`https://som.jlmsz.com/api/scraper/request`, {
          method: 'POST'
        });

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
