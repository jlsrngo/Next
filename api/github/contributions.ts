import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  const username = process.env.GITHUB_USERNAME || 'jlsrngo';
  const token = process.env.GITHUB_TOKEN || '';

  // 1. If GITHUB_TOKEN configured, try GraphQL API
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
            }
            followers { totalCount }
            following { totalCount }
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
        const ghData: any = await ghRes.json();
        const user = ghData?.data?.user;
        if (user) {
          const coll = user.contributionsCollection;
          const cal = coll?.contributionCalendar;
          const weeks = (cal?.weeks || []).map((w: any) =>
            (w.contributionDays || []).map((d: any) => {
              let level = 0;
              switch (d.contributionLevel) {
                case 'FIRST_QUARTILE': level = 1; break;
                case 'SECOND_QUARTILE': level = 2; break;
                case 'THIRD_QUARTILE': level = 3; break;
                case 'FOURTH_QUARTILE': level = 4; break;
              }
              return { date: d.date, count: d.contributionCount, level };
            })
          );

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              username,
              total_contributions: cal?.totalContributions || 1993,
              total_commits: coll?.totalCommitContributions || 1981,
              total_prs: coll?.totalPullRequestContributions || 0,
              total_issues: coll?.totalIssueContributions || 0,
              total_repos: user.repositories?.totalCount || 22,
              followers: user.followers?.totalCount || 0,
              following: user.following?.totalCount || 0,
              weeks,
            })
          );
          return;
        }
      }
    } catch (e) {
      console.error('[API /api/github/contributions GraphQL error]', e);
    }
  }

  // 2. Fallback to cached file
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'github-contributions.json'),
      path.join(process.cwd(), 'dist', 'github-contributions.json'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        res.statusCode = 200;
        res.end(content);
        return;
      }
    }
  } catch {}

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      username,
      total_contributions: 1993,
      total_commits: 1981,
      total_prs: 0,
      total_issues: 0,
      total_repos: 22,
      followers: 0,
      following: 0,
      weeks: [],
    })
  );
}
