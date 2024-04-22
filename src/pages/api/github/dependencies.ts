import { env } from '@/env';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    res.status(400).json({ error: 'username is required' });
    return;
  }
  const { data: repos, ...getReposResult } = await octokit.rest.repos.listForUser({
    username: req.query.username as string,
  });
  if (getReposResult.status !== 200) {
    res.status(getReposResult.status).json(repos);
    return;
  }

  const promises = repos.map((repo) =>
    octokit.rest.repos
      .getContent({
        owner: username,
        repo: repo.name,
        path: 'package-lock.json',
      })
      .then(({ data: repoContent, ...getContentResult }) => {
        if (getContentResult.status !== 200) {
          return {
            name: repo.name,
            status: 'error',
          };
        }
        if (Array.isArray(repoContent) || !('content' in repoContent)) {
          return {
            name: repo.name,
            status: 'error',
          };
        }
        try {
          const packageJson = JSON.parse(Buffer.from(repoContent.content, 'base64').toString());
          const packageData = packageJson.packages[''];
          const dependencies = {
            ...packageData.dependencies,
            ...packageData.devDependencies,
          };
          return {
            name: repo.name,
            status: 'done',
            dependencies,
          };
        } catch (error) {
          return {
            name: repo.name,
            status: 'error',
          };
        }
      })
      .catch((err) => {
        return {
          name: repo.name,
          status: 'error',
        };
      })
  );

  Promise.all(promises).then((data) => {
    res.status(200).json(data);
  });
}
