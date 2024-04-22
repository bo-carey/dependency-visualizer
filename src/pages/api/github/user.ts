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
  octokit.rest.users
    .getByUsername({ username: req.query.username as string })
    .then(({ data: user, ...getUserResult }) => {
      if (getUserResult.status !== 200) {
        res.status(getUserResult.status).json(user);
        return;
      }
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(404).json({ error: 'User not found' });
    });
}
