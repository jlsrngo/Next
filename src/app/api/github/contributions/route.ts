import { NextResponse } from 'next/server'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const CONTRIBUTIONS_QUERY = `
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
`

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME || 'jlsrngo'

  // Try GraphQL if token is configured
  if (token) {
    try {
      const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio',
        },
        body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { username } }),
        next: { revalidate: 3600 },
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.errors && data.data?.user) {
          const userData = data.data.user
          const contrib = userData.contributionsCollection
          const calendar = contrib.contributionCalendar

          const weeks = calendar.weeks.map((week: any) =>
            week.contributionDays.map((day: any) => {
              const levelMap: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }
              return {
                date: day.date,
                count: day.contributionCount,
                level: levelMap[day.contributionLevel] || 0,
              }
            })
          )

          const langCounts: Record<string, { name: string; color: string; count: number }> = {}
          for (const repo of userData.repositories.nodes) {
            const lang = repo.primaryLanguage
            if (lang) {
              if (!langCounts[lang.name]) {
                langCounts[lang.name] = { name: lang.name, color: lang.color || '#888', count: 0 }
              }
              langCounts[lang.name].count++
            }
          }

          const topLanguages = Object.values(langCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)

          return NextResponse.json({
            total_contributions: calendar.totalContributions,
            total_commits: contrib.totalCommitContributions,
            total_prs: contrib.totalPullRequestContributions,
            total_issues: contrib.totalIssueContributions,
            total_repos: userData.repositories.totalCount,
            followers: userData.followers.totalCount,
            following: userData.following.totalCount,
            weeks,
            top_languages: topLanguages,
            username,
          })
        }
      }
    } catch (err) {
      console.warn('GraphQL GitHub fetch failed, attempting public fallback:', err)
    }
  }

  // Fallback to public GitHub API and contributions API
  try {
    const [userRes, reposRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'Portfolio' },
        next: { revalidate: 3600 },
      }).then(r => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
        headers: { 'User-Agent': 'Portfolio' },
        next: { revalidate: 3600 },
      }).then(r => (r.ok ? r.json() : [])),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
        next: { revalidate: 3600 },
      }).then(r => (r.ok ? r.json() : null)),
    ])

    if (!userRes && !contribRes) {
      return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
    }

    const weeks: { date: string; count: number; level: number }[][] = []
    let currentWeek: { date: string; count: number; level: number }[] = []
    for (const day of contribRes?.contributions || []) {
      currentWeek.push({
        date: day.date,
        count: day.count,
        level: day.level,
      })
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    const langColors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      HTML: '#e34c26',
      CSS: '#563d7c',
      'C++': '#f34b7d',
      C: '#555555',
      PHP: '#4F5D95',
      Go: '#00ADD8',
      Rust: '#dea584',
      Java: '#b07219',
      Ruby: '#701516',
      Dart: '#00B4AB',
      Swift: '#F05138',
      Kotlin: '#A97BFF',
      Shell: '#89e051',
    }

    const langCounts: Record<string, number> = {}
    if (Array.isArray(reposRes)) {
      for (const repo of reposRes) {
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
        }
      }
    }

    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        color: langColors[name] || '#888888',
        count,
      }))

    const totalContribs = contribRes?.total?.lastYear ?? 0

    return NextResponse.json({
      total_contributions: totalContribs,
      total_commits: totalContribs,
      total_prs: 0,
      total_issues: 0,
      total_repos: userRes?.public_repos || (Array.isArray(reposRes) ? reposRes.length : 0),
      followers: userRes?.followers || 0,
      following: userRes?.following || 0,
      weeks,
      top_languages: topLanguages,
      username,
    })
  } catch (error) {
    console.error('Error fetching fallback GitHub data:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 502 })
  }
}

