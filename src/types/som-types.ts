export type Project = {
  name: string;
  projectId: number;
  imageUrl: string;
  description: string;
  category: string;
  readmeLink: string;
  demoLink: string;
  repoLink: string;
  projectCreatedAt: string;
  projectUpdatedAt: string;
  minutesSpent: number;
  devlogsCount: number;
  authorName: string;
  authorSlackId: string;
};

export type User = {
  name: string;
  slackId: string;
  minutes: 0;
  devlogs: 0;
};
