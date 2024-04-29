import { env } from '@/env';
import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next/types';

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, repositoryName } = req.query;
  if (!username || typeof username !== 'string')
    return res.status(400).json({ error: 'username is required' });
  if (!repositoryName || typeof repositoryName !== 'string')
    return res.status(400).json({ error: 'repositoryName is required' });

  octokit.rest.repos
    .getContent({
      owner: username,
      repo: repositoryName,
      path: 'package-lock.json',
    })
    .then(({ data: repoContent, ...getContentResult }) => {
      if (getContentResult.status !== 200) {
        return res.status(getContentResult.status).json(repoContent);
      }
      if (Array.isArray(repoContent) || !('content' in repoContent)) {
        return res.status(500).json({ error: 'Dependency info not found' });
      }
      try {
        const packageJson = JSON.parse(Buffer.from(repoContent.content, 'base64').toString());
        const packageData = packageJson.packages[''];
        const dependencies = {
          ...packageData.dependencies,
          ...packageData.devDependencies,
        };
        return res.status(200).json(dependencies);
      } catch (error) {
        return res.status(500).json({ error: 'Unexpected response from GitHub' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to get package-lock.json content from github' });
    });
}
