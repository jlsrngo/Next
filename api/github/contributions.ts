import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: IncomingMessage & { query?: any },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'jlsrngo';

  if (token) {
    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              totalRepositoryContributions
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
            repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
              totalCount
              nodes {
                name
                stargazerCount
                primaryLanguage {
                  name
                  color
                }
              }
            }
            followers {
              totalCount
            }
            following {
              totalCount
            }
          }
        }
      `;

      const ghRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Portfolio-Vercel/1.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      if (ghRes.ok) {
        const ghData = (await ghRes.json()) as any;
        const user = ghData?.data?.user;
        if (user) {
          const contrib = user.contributionsCollection;
          const cal = contrib?.contributionCalendar;
          const total_contributions = cal?.totalContributions || 0;
          const total_commits = contrib?.totalCommitContributions || 0;
          const total_prs = contrib?.totalPullRequestContributions || 0;
          const total_issues = contrib?.totalIssueContributions || 0;
          const total_repos = user.repositories?.totalCount || 0;
          const followers = user.followers?.totalCount || 0;
          const following = user.following?.totalCount || 0;

          const levelMap: Record<string, number> = {
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          const weeks = (cal?.weeks || []).map((w: any) =>
            (w.contributionDays || []).map((d: any) => ({
              date: d.date,
              count: d.contributionCount || 0,
              level: levelMap[d.contributionLevel] || 0,
            }))
          );

          const langCounts: Record<string, { color: string; count: number }> = {};
          for (const node of user.repositories?.nodes || []) {
            if (node.primaryLanguage?.name) {
              const name = node.primaryLanguage.name;
              const color = node.primaryLanguage.color || '#888888';
              if (!langCounts[name]) langCounts[name] = { color, count: 0 };
              langCounts[name].count += 1;
            }
          }

          const top_languages = Object.entries(langCounts)
            .map(([name, val]) => ({ name, color: val.color, count: val.count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);

          const result = {
            username,
            total_contributions,
            total_commits,
            total_prs,
            total_issues,
            total_repos,
            followers,
            following,
            weeks,
            top_languages,
            updated_at: new Date().toISOString(),
          };

          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        }
      }
    } catch (err) {
      console.error('[API/GitHub] GraphQL error:', err);
    }
  }

  // Fallback to static snapshot in public/github-contributions.json
  try {
    const filePath = path.join(process.cwd(), 'public', 'github-contributions.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.statusCode = 200;
      res.end(content);
      return;
    }
  } catch {}

  res.statusCode = 500;
  res.end(JSON.stringify({ error: 'Failed to fetch contributions' }));
}
