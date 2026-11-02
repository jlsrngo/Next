const fs = require('fs');

async function syncGithub() {
  const username = process.env.GITHUB_USERNAME || 'jlsrngo';
  const token = process.env.GITHUB_TOKEN || '';
  console.log(`[sync-github] Fetching live GitHub data for: ${username}...`);

  // 1. Try GraphQL if token exists
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
          followers { totalCount }
          following { totalCount }
        }
      }
      `;

      const gqlRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio',
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const user = gqlData.data?.user;
        if (user) {
          const contrib = user.contributionsCollection;
          const cal = contrib.contributionCalendar;
          const levelMap = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

          const weeks = cal.weeks.map(w =>
            w.contributionDays.map(d => ({
              date: d.date,
              count: d.contributionCount,
              level: levelMap[d.contributionLevel] || 0,
            }))
          );

          const langCounts = {};
          for (const repo of user.repositories.nodes) {
            if (repo.primaryLanguage) {
              const { name, color } = repo.primaryLanguage;
              langCounts[name] = langCounts[name] || { name, color: color || '#888888', count: 0 };
              langCounts[name].count++;
            }
          }

          const topLanguages = Object.values(langCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);

          const result = {
            username,
            total_contributions: cal.totalContributions,
            total_commits: contrib.totalCommitContributions,
            total_prs: contrib.totalPullRequestContributions,
            total_issues: contrib.totalIssueContributions,
            total_repos: user.repositories.totalCount,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            weeks,
            top_languages: topLanguages,
            updated_at: new Date().toISOString(),
          };

          fs.writeFileSync('public/github-contributions.json', JSON.stringify(result, null, 2));
          console.log(`[sync-github] Successfully synced live GraphQL data for ${username}!`);
          return;
        }
      }
    } catch (err) {
      console.warn('[sync-github] GraphQL fetch failed, switching to public API:', err.message);
    }
  }

  // 2. Fetch User Profile
  let user = { public_repos: 17, followers: 0, following: 0 };
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'Portfolio' },
    });
    if (userRes.ok) {
      user = await userRes.json();
    }
  } catch (err) {
    console.warn('[sync-github] Failed to fetch user profile:', err.message);
  }

  // 3. Fetch PR count
  let totalPrs = 0;
  try {
    const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`, {
      headers: { 'User-Agent': 'Portfolio' },
    });
    if (prRes.ok) {
      const prData = await prRes.json();
      totalPrs = prData.total_count || 0;
    }
  } catch {}

  // 4. Fetch Repos for Language Breakdown
  let topLanguages = [];
  try {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      headers: { 'User-Agent': 'Portfolio' },
    });
    if (reposRes.ok) {
      const repos = await reposRes.json();
      const langCounts = {};
      for (const repo of repos) {
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      }

      const paletteMap = {
        TypeScript: '#69D2E7',
        HTML: '#FFA07A',
        Python: '#90EE90',
        CSS: '#CCCCFF',
        JavaScript: '#FFDB58',
        'C++': '#F4C2D7',
        Rust: '#FFA07A',
        Go: '#69D2E7',
      };

      topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([name, count]) => ({
          name,
          color: paletteMap[name] || '#888888',
          count,
        }));
    }
  } catch (err) {
    console.warn('[sync-github] Failed to fetch repos:', err.message);
  }

  // 5. Fetch Contributions (Try edge API first, fallback to scraping)
  let weeks = [];
  let totalContributions = 0;

  try {
    const edgeRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (edgeRes.ok) {
      const edgeData = await edgeRes.json();
      totalContributions = edgeData.total?.lastYear || edgeData.total?.['2026'] || 0;
      const days = edgeData.contributions || [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }
    }
  } catch (err) {
    console.warn('[sync-github] Edge contributions API failed, fallback to scrape:', err.message);
  }

  // Fallback to HTML scrape if edge API had no weeks
  if (weeks.length === 0) {
    try {
      const calRes = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      if (calRes.ok) {
        const html = await calRes.text();
        const totalMatch = html.match(/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
        if (totalMatch) {
          totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
        }

        const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
        const tooltips = {};
        let tMatch;
        while ((tMatch = tooltipRegex.exec(html)) !== null) {
          tooltips[tMatch[1]] = tMatch[2].trim();
        }

        const days = [];
        const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d+)"[^>]*>/g;
        let match;
        while ((match = dayRegex.exec(html)) !== null) {
          const date = match[1];
          const id = match[2];
          const level = parseInt(match[3], 10);
          const tip = tooltips[id] || '';
          let count = 0;
          const cMatch = tip.match(/(\d+)\s+contribution/i);
          if (cMatch) {
            count = parseInt(cMatch[1], 10);
          }
          days.push({ date, level, count });
        }

        days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        for (let i = 0; i < days.length; i += 7) {
          weeks.push(days.slice(i, i + 7));
        }
      }
    } catch (err) {
      console.warn('[sync-github] HTML scrape failed:', err.message);
    }
  }

  const result = {
    username,
    total_contributions: totalContributions,
    total_commits: totalContributions,
    total_prs: totalPrs,
    total_issues: 0,
    total_repos: user.public_repos || 17,
    followers: user.followers || 0,
    following: user.following || 0,
    weeks,
    top_languages: topLanguages,
    updated_at: new Date().toISOString(),
  };

  fs.writeFileSync('public/github-contributions.json', JSON.stringify(result, null, 2));
  console.log(`[sync-github] Live sync completed: ${totalContributions} contributions, ${weeks.length} weeks.`);
}

syncGithub().catch(console.error);
