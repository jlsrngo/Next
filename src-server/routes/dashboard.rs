use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{get_snapshot, SharedState};

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

    let mut total_contributions: i64 = 1957;
    let mut total_repos: i64 = 17;
    let mut total_prs: i64 = 0;
    let mut followers: i64 = 0;

    if let Ok(content) = std::fs::read_to_string("public/github-contributions.json") {
        if let Ok(gh) = serde_json::from_str::<Value>(&content) {
            if let Some(v) = gh.get("total_contributions").and_then(|v| v.as_i64()) {
                total_contributions = v;
            }
            if let Some(v) = gh.get("total_repos").and_then(|v| v.as_i64()) {
                total_repos = v;
            }
            if let Some(v) = gh.get("total_prs").and_then(|v| v.as_i64()) {
                total_prs = v;
            }
            if let Some(v) = gh.get("followers").and_then(|v| v.as_i64()) {
                followers = v;
            }
        }
    }

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

pub async fn github_contributions_handler() -> impl IntoResponse {
    if let Ok(content) = std::fs::read_to_string("public/github-contributions.json") {
        if let Ok(val) = serde_json::from_str::<Value>(&content) {
            return (StatusCode::OK, Json(val));
        }
    }

    (
        StatusCode::OK,
        Json(json!({
            "total_contributions": 1957,
            "total_repos": 17,
            "total_prs": 0,
            "followers": 0,
            "contributions": []
        })),
    )
}

