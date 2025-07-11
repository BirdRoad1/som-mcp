import path from 'path';
import { Tool } from '../tool';
import { z } from 'zod';
import { spawnSync } from 'child_process';
import fs from 'fs';

export const register: Tool = server => {
  server.registerTool(
    'cloneProjectRepo',
    {
      description:
        "Clones a project's repo (if available) to disk. If includeGitLog is true, the full output of the git log command will be included. Only supports github.",
      inputSchema: {
        projectId: z.number().int().gte(0),
        cloneParentDir: z.string(),
        includeGitLog: z.boolean().default(false)
      }
    },
    async ({ projectId, cloneParentDir, includeGitLog }) => {
      try {
        if (!fs.existsSync(cloneParentDir)) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: The path ${cloneParentDir} does not exist`
              }
            ]
          };
        }
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

        const project = (await res.json()).project;
        const repoLink: string = project.repoLink;
        if (!repoLink) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: The project has no repo link attached'
              }
            ]
          };
        }

        const url = new URL(repoLink);
        if (
          url.hostname !== 'github.com' &&
          url.hostname !== 'www.github.com'
        ) {
          return {
            content: [
              {
                type: 'text',
                text:
                  'Error: Only GitHub repos are supported. Repo: ' + repoLink
              }
            ]
          };
        }

        const { pathname } = url;

        const matches = /^\/([^/]+)\/([^/]+)$/.exec(pathname);
        if (matches === null) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid repo path: ' + pathname
              }
            ]
          };
        }

        const [, author, name] = matches;

        const folderName = path.join(
          cloneParentDir,
          `${crypto.randomUUID()}-${author}-${name}/`
        );

        const ret = spawnSync('git', ['clone', repoLink, folderName]);

        const gitOutput = ret.stderr.toString('utf-8');

        const folderExistence = fs.existsSync(folderName);

        const repoFolder = path.resolve(folderName);

        let gitLog: string | undefined = undefined;
        if (folderExistence && includeGitLog) {
          const ret = spawnSync('git', ['--no-pager', 'log', '-p'], {
            cwd: repoFolder
          });
          gitLog = ret.stdout.toString('utf-8');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                gitOutput,
                repoFolderCreated: folderExistence,
                repoFolder,
                gitLog
              })
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
