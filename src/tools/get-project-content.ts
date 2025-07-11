import { Tool } from '../types/tool.js';
import { z } from 'zod';

export const register: Tool = server => {
  server.registerTool(
    'getProjectContent',
    {
      description: "Fetches the content from a project's resource if available",
      inputSchema: {
        projectId: z.number().int().gte(0),
        resourceType: z.enum(['readme', 'demo', 'repo'])
      }
    },
    async ({ projectId, resourceType }) => {
      try {
        const res = await fetch(
          `https://som.jlmsz.com/api/projects/${projectId}`
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

        const { readmeLink, demoLink, repoLink } = (await res.json()).project;

        const linkToUse: string =
          resourceType === 'demo'
            ? demoLink
            : resourceType === 'readme'
            ? readmeLink
            : resourceType === 'repo'
            ? repoLink
            : '';

        if (!linkToUse) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: The link type link does not exist for this project'
              }
            ]
          };
        }

        let data: string;
        try {
          const res = await fetch(linkToUse);
          data = await res.text();

          return {
            content: [
              {
                type: 'text',
                text: data
              }
            ]
          };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [
              {
                type: 'text',
                text: `Failed to fetch resourcce: ${linkToUse}, error:${message}`
              }
            ]
          };
        }
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
