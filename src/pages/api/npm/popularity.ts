import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

const npmSearchResultSchema = z.object({
  total: z.number(),
  results: z.array(
    z.object({
      package: z.object({
        name: z.string(),
        links: z
          .object({
            repository: z.string().optional(),
          })
          .optional(),
      }),
      score: z.object({
        final: z.number(),
        detail: z.object({
          quality: z.number(),
          popularity: z.number(),
          maintenance: z.number(),
        }),
      }),
    })
  ),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'package name is required' });
    return;
  }

  fetch(`https://api.npms.io/v2/search?q="${name}"`)
    .then((res) => res.json())
    .then((data) => {
      try {
        const npmSearchResult = npmSearchResultSchema.parse(data);
        const packageInfo = npmSearchResult.results[0];
        if (!packageInfo) {
          return res.status(404).json({ error: 'Package not found' });
        }
        const popularity = packageInfo.score.detail.popularity;
        res.status(200).json(popularity);
      } catch (error) {
        res.status(500).json({ error: 'Unexpected response from npms.io' });
      }
    });
}
