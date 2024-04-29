import { env } from '@/env';
import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next/types';

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    res.status(400).json({ error: 'username is required' });
    return;
  }
  octokit.rest.repos
    .listForUser({ username })
    .then(({ data: repo, ...listForUserResult }) => {
      if (listForUserResult.status !== 200) {
        res.status(listForUserResult.status).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(repo);
    })
    .catch(() => {
      res.status(404).json({ error: 'User not found' });
    });
}
