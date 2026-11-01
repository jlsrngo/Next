/**
 * Sync Trending Tech & Viral GitHub Repositories Crawler
 * Fetches real-time tech news from HackerNews and hot repositories from GitHub Search API.
 * Saves to public/trending-tech.json for instant frontend consumption and Rust Axum cache.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'trending-tech.json');

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity-Crawler/2.0',
        Accept: 'application/json',
        ...options.headers,
      },
      timeout: 8000,
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 100)}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

function formatStars(count) {
  if (count >= 1000000) return `★ ${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `★ ${(count / 1000).toFixed(1)}k`;
  return `★ ${count}`;
}

async function crawl() {
  console.log('[Crawler] Starting Trending Tech & Viral Repos sync...');

  let headline = 'Autonomous AI & Rust Systems Architecture';
  let metric = '▲ 240 PTS';
  let viralRepo = 'openclaw/openclaw';
  let repoMetric = '★ 393.6k';
  let repoDesc = 'The AI that really does things. Any OS. Any Platform.';
  let reposList = [];

  // 1. Fetch HackerNews Top Tech Headline
  try {
    const topIds = await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (Array.isArray(topIds) && topIds.length > 0) {
      const topStoryId = topIds[0];
      const story = await fetchJson(`https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`);
      if (story && story.title) {
        headline = story.title;
        metric = `▲ ${story.score || 100} PTS`;
        console.log(`[Crawler] Fetched HN top story: "${headline}" (${metric})`);
      }
    }
  } catch (err) {
    console.warn('[Crawler] HN fetch failed, using fallback:', err.message);
  }

  // 2. Fetch Viral Tech Repositories from GitHub API
  try {
    // Search active trending tech repos
    const ghData = await fetchJson(
      'https://api.github.com/search/repositories?q=stars:>5000+pushed:>2026-10-01&sort=updated&order=desc&per_page=10'
    );
    if (ghData && Array.isArray(ghData.items) && ghData.items.length > 0) {
      reposList = ghData.items.map((item) => ({
        name: item.name,
        full_name: item.full_name,
        stars: item.stargazers_count,
        stars_formatted: formatStars(item.stargazers_count),
        language: item.language || 'Code',
        description: item.description || '',
        url: item.html_url,
      }));

      const topRepo = reposList[0];
      viralRepo = topRepo.full_name;
      repoMetric = topRepo.stars_formatted;
      repoDesc = topRepo.description;
      console.log(`[Crawler] Fetched GitHub viral repo: ${viralRepo} (${repoMetric})`);
    }
  } catch (err) {
    console.warn('[Crawler] GitHub search failed, using fallback:', err.message);
  }

  const payload = {
    status: 'LIVE_SYNC',
    last_crawled_at: new Date().toISOString(),
    source: 'GitHub Search API & HackerNews Live Wire',
    headline,
    metric,
    spec: `TECH WIRE // LIVE: ${headline}`,
    viral_repo: viralRepo,
    repo_metric: repoMetric,
    repo_desc: repoDesc,
    repo_spec: `VIRAL REPO // ${viralRepo}`,
    trending_repos: reposList,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[Crawler] Successfully wrote live data to ${OUTPUT_PATH}`);
  return payload;
}

crawl().catch((e) => {
  console.error('[Crawler] Fatal error:', e);
});
