use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, get_snapshot, SharedState};

pub async fn achievements_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, title, description, issuer, date::text as date_str, credential_url, featured, \"order\" FROM achievements ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let title: String = r.try_get("title").unwrap_or_default();
                let description: String = r.try_get("description").unwrap_or_default();
                let issuer: Option<String> = r.try_get("issuer").ok();
                let date_str: Option<String> = r.try_get("date_str").ok();
                let credential_url: Option<String> = r.try_get("credential_url").ok();
                let featured: bool = r.try_get("featured").unwrap_or(false);
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "title": title,
                    "description": description,
                    "issuer": issuer.unwrap_or_default(),
                    "issueDate": date_str,
                    "date": date_str,
                    "credentialUrl": credential_url,
                    "credential_url": credential_url,
                    "featured": featured,
                    "order": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }

    if let Some(snap) = get_snapshot() {
        if let Some(achievements) = snap.get("achievements") {
            return (StatusCode::OK, Json(achievements.clone()));
        }
    }

    (StatusCode::OK, Json(json!([])))
}

pub async fn create_achievement_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("ach");
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or("Untitled Award");
    let issuer = payload.get("issuer").and_then(|v| v.as_str()).unwrap_or("Institution");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let credential_url = payload.get("credentialUrl").or_else(|| payload.get("credential_url")).and_then(|v| v.as_str());
    let featured = payload.get("featured").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            INSERT INTO achievements (id, title, description, issuer, date, credential_url, featured, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, NOW(), NOW())
            "#
        )
        .bind(&id)
        .bind(title)
        .bind(description)
        .bind(issuer)
        .bind(credential_url)
        .bind(featured)
        .bind(order)
        .execute(pool)
        .await;
    }

    (StatusCode::CREATED, Json(json!({ "id": id, "title": title, "issuer": issuer })))
}

pub async fn update_achievement_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let title = payload.get("title").and_then(|v| v.as_str()).unwrap_or("Untitled Award");
    let issuer = payload.get("issuer").and_then(|v| v.as_str()).unwrap_or("Institution");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let credential_url = payload.get("credentialUrl").or_else(|| payload.get("credential_url")).and_then(|v| v.as_str());
    let featured = payload.get("featured").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            UPDATE achievements
            SET title = $1, description = $2, issuer = $3, credential_url = $4,
                featured = $5, "order" = $6, updated_at = NOW()
            WHERE id = $7
            "#
        )
        .bind(title)
        .bind(description)
        .bind(issuer)
        .bind(credential_url)
        .bind(featured)
        .bind(order)
        .bind(&id)
        .execute(pool)
        .await;
    }

    (StatusCode::OK, Json(json!({ "success": true, "id": id })))
}

pub async fn delete_achievement_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let _ = sqlx::query("DELETE FROM achievements WHERE id = $1").bind(&id).execute(pool).await;
    }
    (StatusCode::OK, Json(json!({ "success": true, "deleted": id })))
}
