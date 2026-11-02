use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::{json, Value};
use sqlx::Row;
use std::collections::HashMap;
use std::time::{Duration, Instant};
use crate::state::{get_snapshot, CachedGithub, SharedState};

pub async fn fetch_live_github_data(http_client: &reqwest::Client) -> Option<Value> {
    let username = std::env::var("GITHUB_USERNAME").unwrap_or_else(|_| "jlsrngo".to_string());
    let token = std::env::var("GITHUB_TOKEN").unwrap_or_default();

    // 1. If GITHUB_TOKEN configured, try GraphQL API
    if !token.is_empty() {
        let query = r#"
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
        "#;

        let res = http_client
            .post("https://api.github.com/graphql")
            .header("Authorization", format!("Bearer {}", token))
            .header("User-Agent", "Portfolio-Axum/1.0")
            .json(&json!({ "query": query, "variables": { "username": username } }))
            .send()
            .await;

        if let Ok(resp) = res {
            if resp.status().is_success() {
                if let Ok(data) = resp.json::<Value>().await {
                    if let Some(user) = data.get("data").and_then(|d| d.get("user")) {
                        let contrib = user.get("contributionsCollection");
                        let cal = contrib.and_then(|c| c.get("contributionCalendar"));
                        let total_contribs = cal
                            .and_then(|c| c.get("totalContributions"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let total_commits = contrib
                            .and_then(|c| c.get("totalCommitContributions"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let total_prs = contrib
                            .and_then(|c| c.get("totalPullRequestContributions"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let total_issues = contrib
                            .and_then(|c| c.get("totalIssueContributions"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let total_repos = user
                            .get("repositories")
                            .and_then(|r| r.get("totalCount"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let followers = user
                            .get("followers")
                            .and_then(|f| f.get("totalCount"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);
                        let following = user
                            .get("following")
                            .and_then(|f| f.get("totalCount"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0);

                        let mut weeks = Vec::new();
                        if let Some(w_arr) = cal.and_then(|c| c.get("weeks")).and_then(|w| w.as_array()) {
                            for w in w_arr {
                                if let Some(days) = w.get("contributionDays").and_then(|d| d.as_array()) {
                                    let mut week_days = Vec::new();
                                    for day in days {
                                        let level_str = day.get("contributionLevel").and_then(|l| l.as_str()).unwrap_or("NONE");
                                        let level = match level_str {
                                            "FIRST_QUARTILE" => 1,
                                            "SECOND_QUARTILE" => 2,
                                            "THIRD_QUARTILE" => 3,
                                            "FOURTH_QUARTILE" => 4,
                                            _ => 0,
                                        };
                                        week_days.push(json!({
                                            "date": day.get("date"),
                                            "count": day.get("contributionCount").and_then(|c| c.as_i64()).unwrap_or(0),
                                            "level": level
                                        }));
                                    }
                                    weeks.push(Value::Array(week_days));
                                }
                            }
                        }

                        let mut lang_counts: HashMap<String, (String, i64)> = HashMap::new();
                        if let Some(nodes) = user.get("repositories").and_then(|r| r.get("nodes")).and_then(|n| n.as_array()) {
                            for repo in nodes {
                                if let Some(pl) = repo.get("primaryLanguage") {
                                    if let Some(name) = pl.get("name").and_then(|n| n.as_str()) {
                                        let color = pl.get("color").and_then(|c| c.as_str()).unwrap_or("#888888").to_string();
                                        let entry = lang_counts.entry(name.to_string()).or_insert((color, 0));
                                        entry.1 += 1;
                                    }
                                }
                            }
                        }

                        let mut top_languages: Vec<Value> = lang_counts
                            .into_iter()
                            .map(|(name, (color, count))| json!({ "name": name, "color": color, "count": count }))
                            .collect();
                        top_languages.sort_by(|a, b| {
                            let ca = a.get("count").and_then(|c| c.as_i64()).unwrap_or(0);
                            let cb = b.get("count").and_then(|c| c.as_i64()).unwrap_or(0);
                            cb.cmp(&ca)
                        });
                        top_languages.truncate(7);

                        return Some(json!({
                            "username": username,
                            "total_contributions": total_contribs,
                            "total_commits": total_commits,
                            "total_prs": total_prs,
                            "total_issues": total_issues,
                            "total_repos": total_repos,
                            "followers": followers,
                            "following": following,
                            "weeks": weeks,
                            "top_languages": top_languages,
                            "updated_at": chrono::Utc::now().to_rfc3339()
                        }));
                    }
                }
            }
        }
    }

    // 2. Fallback: Edge contributions API + GitHub REST API (No token required)
    let contrib_url = format!("https://github-contributions-api.jogruber.de/v4/{}?y=last", username);
    let user_url = format!("https://api.github.com/users/{}", username);
    let repos_url = format!("https://api.github.com/users/{}/repos?per_page=100&sort=pushed", username);
    let prs_url = format!("https://api.github.com/search/issues?q=author:{}+type:pr", username);

    let contrib_fut = http_client.get(&contrib_url).header("User-Agent", "Portfolio-Axum/1.0").send();
    let user_fut = http_client.get(&user_url).header("User-Agent", "Portfolio-Axum/1.0").send();
    let repos_fut = http_client.get(&repos_url).header("User-Agent", "Portfolio-Axum/1.0").send();
    let prs_fut = http_client.get(&prs_url).header("User-Agent", "Portfolio-Axum/1.0").send();

    let (contrib_res, user_res, repos_res, prs_res) = tokio::join!(contrib_fut, user_fut, repos_fut, prs_fut);

    let mut total_contributions: i64 = 0;
    let mut weeks: Vec<Value> = Vec::new();

    if let Ok(resp) = contrib_res {
        if resp.status().is_success() {
            if let Ok(contrib_data) = resp.json::<Value>().await {
                if let Some(total_obj) = contrib_data.get("total") {
                    total_contributions = total_obj
                        .get("lastYear")
                        .and_then(|v| v.as_i64())
                        .or_else(|| total_obj.get("2026").and_then(|v| v.as_i64()))
                        .unwrap_or(0);
                }

                if let Some(days_arr) = contrib_data.get("contributions").and_then(|c| c.as_array()) {
                    for chunk in days_arr.chunks(7) {
                        weeks.push(Value::Array(chunk.to_vec()));
                    }
                }
            }
        }
    }

    let mut total_repos: i64 = 0;
    let mut followers: i64 = 0;
    let mut following: i64 = 0;

    if let Ok(resp) = user_res {
        if resp.status().is_success() {
            if let Ok(user_data) = resp.json::<Value>().await {
                total_repos = user_data.get("public_repos").and_then(|v| v.as_i64()).unwrap_or(0);
                followers = user_data.get("followers").and_then(|v| v.as_i64()).unwrap_or(0);
                following = user_data.get("following").and_then(|v| v.as_i64()).unwrap_or(0);
            }
        }
    }

    let mut total_prs: i64 = 0;
    if let Ok(resp) = prs_res {
        if resp.status().is_success() {
            if let Ok(prs_data) = resp.json::<Value>().await {
                total_prs = prs_data.get("total_count").and_then(|v| v.as_i64()).unwrap_or(0);
            }
        }
    }

    let mut lang_counts: HashMap<String, i64> = HashMap::new();
    if let Ok(resp) = repos_res {
        if resp.status().is_success() {
            if let Ok(repos_data) = resp.json::<Value>().await {
                if let Some(repos_arr) = repos_data.as_array() {
                    for repo in repos_arr {
                        if let Some(lang) = repo.get("language").and_then(|l| l.as_str()) {
                            *lang_counts.entry(lang.to_string()).or_insert(0) += 1;
                        }
                    }
                }
            }
        }
    }

    let palette = [
        ("TypeScript", "#69D2E7"),
        ("HTML", "#FFA07A"),
        ("Python", "#90EE90"),
        ("CSS", "#CCCCFF"),
        ("JavaScript", "#FFDB58"),
        ("C++", "#F4C2D7"),
        ("Rust", "#FFA07A"),
        ("Go", "#69D2E7"),
    ];

    let mut top_languages: Vec<Value> = lang_counts
        .into_iter()
        .map(|(name, count)| {
            let color = palette.iter().find(|(k, _)| *k == name).map(|(_, c)| *c).unwrap_or("#888888");
            json!({ "name": name, "color": color, "count": count })
        })
        .collect();
    top_languages.sort_by(|a, b| {
        let ca = a.get("count").and_then(|c| c.as_i64()).unwrap_or(0);
        let cb = b.get("count").and_then(|c| c.as_i64()).unwrap_or(0);
        cb.cmp(&ca)
    });
    top_languages.truncate(7);

    if !weeks.is_empty() || total_repos > 0 {
        Some(json!({
            "username": username,
            "total_contributions": total_contributions,
            "total_commits": total_contributions,
            "total_prs": total_prs,
            "total_issues": 0,
            "total_repos": total_repos,
            "followers": followers,
            "following": following,
            "weeks": weeks,
            "top_languages": top_languages,
            "updated_at": chrono::Utc::now().to_rfc3339()
        }))
    } else {
        None
    }
}

pub async fn get_github_data(state: &SharedState) -> Value {
    // 1. In-memory cache hit (TTL 5 minutes)
    {
        let cache = state.github_cache.read().await;
        if let Some(cached) = &*cache {
            if cached.fetched_at.elapsed() < Duration::from_secs(300) {
                return cached.data.clone();
            }
        }
    }

    // 2. Live fetch
    if let Some(live_data) = fetch_live_github_data(&state.http_client).await {
        {
            let mut cache = state.github_cache.write().await;
            *cache = Some(CachedGithub {
                data: live_data.clone(),
                fetched_at: Instant::now(),
            });
        }
        // Write to public folder to keep disk snapshot fresh
        let _ = std::fs::write(
            "public/github-contributions.json",
            serde_json::to_string_pretty(&live_data).unwrap_or_default(),
        );
        return live_data;
    }

    // 3. Disk snapshot fallback
    if let Ok(content) = std::fs::read_to_string("public/github-contributions.json") {
        if let Ok(val) = serde_json::from_str::<Value>(&content) {
            return val;
        }
    }

    // 4. Default baseline
    json!({
        "username": "jlsrngo",
        "total_contributions": 1684,
        "total_repos": 17,
        "total_prs": 0,
        "followers": 0,
        "following": 0,
        "weeks": []
    })
}

pub async fn dashboard_handler(State(state): State<SharedState>) -> impl IntoResponse {
    let mut total_projects: i64 = 0;
    let mut featured_projects: i64 = 0;
    let mut total_achievements: i64 = 0;

    if let Some(pool) = &state.pool {
        if let Ok(row) = sqlx::query("SELECT count(*) as count FROM projects").fetch_one(pool).await {
            total_projects = row.try_get::<i64, _>("count").unwrap_or(0);
        }
        if let Ok(row) = sqlx::query("SELECT count(*) as count FROM projects WHERE featured = true").fetch_one(pool).await {
            featured_projects = row.try_get::<i64, _>("count").unwrap_or(0);
        }
        if let Ok(row) = sqlx::query("SELECT count(*) as count FROM achievements").fetch_one(pool).await {
            total_achievements = row.try_get::<i64, _>("count").unwrap_or(0);
        }
    } else if let Some(snap) = get_snapshot() {
        if let Some(stats) = snap.get("stats") {
            total_projects = stats.get("total_projects").and_then(|v| v.as_i64()).unwrap_or(0);
            featured_projects = stats.get("featured_projects").and_then(|v| v.as_i64()).unwrap_or(0);
            total_achievements = stats.get("total_achievements").and_then(|v| v.as_i64()).unwrap_or(0);
        }
    }

    let gh = get_github_data(&state).await;

    let total_contributions = gh.get("total_contributions").and_then(|v| v.as_i64()).unwrap_or(0);
    let total_repos = gh.get("total_repos").and_then(|v| v.as_i64()).unwrap_or(0);
    let total_prs = gh.get("total_prs").and_then(|v| v.as_i64()).unwrap_or(0);
    let followers = gh.get("followers").and_then(|v| v.as_i64()).unwrap_or(0);

    (
        StatusCode::OK,
        Json(json!({
            "total_projects": total_projects,
            "featured_projects": featured_projects,
            "total_achievements": total_achievements,
            "total_contributions": total_contributions,
            "total_repos": total_repos,
            "total_prs": total_prs,
            "followers": followers
        })),
    )
}

pub async fn github_contributions_handler(State(state): State<SharedState>) -> impl IntoResponse {
    let data = get_github_data(&state).await;
    (StatusCode::OK, Json(data))
}
