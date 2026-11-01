use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, get_snapshot, SharedState};

pub async fn projects_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, title, description, image_url, live_url, github_url, tech_stack, featured, \"order\" FROM projects ORDER BY \"order\" ASC, created_at DESC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let title: String = r.try_get("title").unwrap_or_default();
                let description: String = r.try_get("description").unwrap_or_default();
                let image_url: Option<String> = r.try_get("image_url").ok();
                let live_url: Option<String> = r.try_get("live_url").ok();
                let github_url: Option<String> = r.try_get("github_url").ok();
                let tech_stack: Vec<String> = r.try_get("tech_stack").unwrap_or_default();
                let featured: bool = r.try_get("featured").unwrap_or(false);
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "title": title,
                    "description": description,
                    "image_url": image_url,
                    "imageUrl": image_url,
                    "live_url": live_url,
                    "liveUrl": live_url,
                    "github_url": github_url,
                    "githubUrl": github_url,
                    "tech_stack": tech_stack,
                    "techStack": tech_stack,
                    "featured": featured,
                    "order": order,
                    "order_index": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }

    if let Some(snap) = get_snapshot() {
        if let Some(projects) = snap.get("projects") {
            return (StatusCode::OK, Json(projects.clone()));
        }
    }

    (StatusCode::OK, Json(json!([])))
}

pub async fn create_project_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("proj");
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or("Untitled Project");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let image_url = payload.get("imageUrl").or_else(|| payload.get("image_url")).and_then(|v| v.as_str());
    let live_url = payload.get("liveUrl").or_else(|| payload.get("live_url")).and_then(|v| v.as_str());
    let github_url = payload.get("githubUrl").or_else(|| payload.get("github_url")).and_then(|v| v.as_str());
    let featured = payload.get("featured").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    let mut tech_stack: Vec<String> = Vec::new();
    if let Some(arr) = payload.get("techStack").or_else(|| payload.get("tech_stack")).and_then(|v| v.as_array()) {
        for item in arr {
            if let Some(s) = item.as_str() {
                tech_stack.push(s.to_string());
            }
        }
    }

    if let Some(pool) = &state.pool {
        let res = sqlx::query(
            r#"
            INSERT INTO projects (id, title, description, image_url, live_url, github_url, tech_stack, featured, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            "#
        )
        .bind(&id)
        .bind(title)
        .bind(description)
        .bind(image_url)
        .bind(live_url)
        .bind(github_url)
        .bind(&tech_stack)
        .bind(featured)
        .bind(order)
        .execute(pool)
        .await;

        if let Err(e) = res {
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() })));
        }
    }

    (StatusCode::CREATED, Json(json!({
        "id": id,
        "title": title,
        "description": description,
        "imageUrl": image_url,
        "liveUrl": live_url,
        "githubUrl": github_url,
        "techStack": tech_stack,
        "featured": featured,
        "order": order
    })))
}

pub async fn update_project_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or("Untitled Project");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let image_url = payload.get("imageUrl").or_else(|| payload.get("image_url")).and_then(|v| v.as_str());
    let live_url = payload.get("liveUrl").or_else(|| payload.get("live_url")).and_then(|v| v.as_str());
    let github_url = payload.get("githubUrl").or_else(|| payload.get("github_url")).and_then(|v| v.as_str());
    let featured = payload.get("featured").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    let mut tech_stack: Vec<String> = Vec::new();
    if let Some(arr) = payload.get("techStack").or_else(|| payload.get("tech_stack")).and_then(|v| v.as_array()) {
        for item in arr {
            if let Some(s) = item.as_str() {
                tech_stack.push(s.to_string());
            }
        }
    }

    if let Some(pool) = &state.pool {
        let res = sqlx::query(
            r#"
            UPDATE projects
            SET title = $1, description = $2, image_url = $3, live_url = $4, github_url = $5,
                tech_stack = $6, featured = $7, "order" = $8, updated_at = NOW()
            WHERE id = $9
            "#
        )
        .bind(title)
        .bind(description)
        .bind(image_url)
        .bind(live_url)
        .bind(github_url)
        .bind(&tech_stack)
        .bind(featured)
        .bind(order)
        .bind(&id)
        .execute(pool)
        .await;

        if let Err(e) = res {
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() })));
        }
    }

    (StatusCode::OK, Json(json!({ "success": true, "id": id })))
}

pub async fn delete_project_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let _ = sqlx::query("DELETE FROM projects WHERE id = $1")
            .bind(&id)
            .execute(pool)
            .await;
    }
    (StatusCode::OK, Json(json!({ "success": true, "deleted": id })))
}
