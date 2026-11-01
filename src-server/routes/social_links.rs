use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, get_snapshot, SharedState};

pub async fn social_links_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, platform, title, description, url, is_featured, \"order\" FROM social_links ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let platform: String = r.try_get("platform").unwrap_or_default();
                let title: String = r.try_get("title").unwrap_or_default();
                let description: Option<String> = r.try_get("description").ok();
                let url: String = r.try_get("url").unwrap_or_default();
                let is_featured: bool = r.try_get("is_featured").unwrap_or(false);
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "platform": platform,
                    "title": title,
                    "description": description.unwrap_or_default(),
                    "url": url,
                    "username": url,
                    "is_featured": is_featured,
                    "order": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }

    if let Some(snap) = get_snapshot() {
        if let Some(links) = snap.get("socialLinks") {
            return (StatusCode::OK, Json(links.clone()));
        }
    }

    (StatusCode::OK, Json(json!([])))
}

pub async fn create_social_link_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("link");
    let platform = payload.get("platform").and_then(|v| v.as_str()).unwrap_or("Network");
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or(platform);
    let url = payload.get("url").and_then(|v| v.as_str()).unwrap_or("https://");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let is_featured = payload.get("is_featured").or_else(|| payload.get("isFeatured")).and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            INSERT INTO social_links (id, platform, title, description, url, is_featured, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            "#
        )
        .bind(&id)
        .bind(platform)
        .bind(title)
        .bind(description)
        .bind(url)
        .bind(is_featured)
        .bind(order)
        .execute(pool)
        .await;
    }

    (StatusCode::CREATED, Json(json!({ "id": id, "platform": platform, "url": url })))
}

pub async fn update_social_link_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let platform = payload.get("platform").and_then(|v| v.as_str()).unwrap_or("Network");
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or(platform);
    let url = payload.get("url").and_then(|v| v.as_str()).unwrap_or("https://");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let is_featured = payload.get("is_featured").or_else(|| payload.get("isFeatured")).and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            UPDATE social_links
            SET platform = $1, title = $2, description = $3, url = $4,
                is_featured = $5, "order" = $6, updated_at = NOW()
            WHERE id = $7
            "#
        )
        .bind(platform)
        .bind(title)
        .bind(description)
        .bind(url)
        .bind(is_featured)
        .bind(order)
        .bind(&id)
        .execute(pool)
        .await;
    }

    (StatusCode::OK, Json(json!({ "success": true, "id": id })))
}

pub async fn delete_social_link_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let _ = sqlx::query("DELETE FROM social_links WHERE id = $1").bind(&id).execute(pool).await;
    }
    (StatusCode::OK, Json(json!({ "success": true, "deleted": id })))
}
