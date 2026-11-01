use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, SharedState};

pub async fn experiences_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, company, position, location, start_date::text as start_date, end_date::text as end_date, current, description, \"order\" FROM work_experiences ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let company: String = r.try_get("company").unwrap_or_default();
                let position: String = r.try_get("position").unwrap_or_default();
                let location: Option<String> = r.try_get("location").ok();
                let start_date: Option<String> = r.try_get("start_date").ok();
                let end_date: Option<String> = r.try_get("end_date").ok();
                let current: bool = r.try_get("current").unwrap_or(false);
                let description: String = r.try_get("description").unwrap_or_default();
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "company": company,
                    "position": position,
                    "location": location.unwrap_or_else(|| "Indonesia".to_string()),
                    "startDate": start_date,
                    "endDate": end_date,
                    "current": current,
                    "description": description,
                    "order": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }
    (StatusCode::OK, Json(json!([])))
}

pub async fn create_experience_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("exp");
    let company = payload.get("company").and_then(|v| v.as_str()).unwrap_or("Company");
    let position = payload.get("position").and_then(|v| v.as_str()).unwrap_or("Engineer");
    let location = payload.get("location").and_then(|v| v.as_str()).unwrap_or("Remote");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let current = payload.get("current").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            INSERT INTO work_experiences (id, company, position, location, start_date, end_date, current, description, responsibilities, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NULL, $5, $6, '[]'::json, $7, NOW(), NOW())
            "#
        )
        .bind(&id)
        .bind(company)
        .bind(position)
        .bind(location)
        .bind(current)
        .bind(description)
        .bind(order)
        .execute(pool)
        .await;
    }

    (StatusCode::CREATED, Json(json!({ "id": id, "company": company, "position": position })))
}

pub async fn update_experience_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let company = payload.get("company").and_then(|v| v.as_str()).unwrap_or("Company");
    let position = payload.get("position").and_then(|v| v.as_str()).unwrap_or("Engineer");
    let location = payload.get("location").and_then(|v| v.as_str()).unwrap_or("Remote");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let current = payload.get("current").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            UPDATE work_experiences
            SET company = $1, position = $2, location = $3, current = $4,
                description = $5, "order" = $6, updated_at = NOW()
            WHERE id = $7
            "#
        )
        .bind(company)
        .bind(position)
        .bind(location)
        .bind(current)
        .bind(description)
        .bind(order)
        .bind(&id)
        .execute(pool)
        .await;
    }

    (StatusCode::OK, Json(json!({ "success": true, "id": id })))
}

pub async fn delete_experience_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let _ = sqlx::query("DELETE FROM work_experiences WHERE id = $1").bind(&id).execute(pool).await;
    }
    (StatusCode::OK, Json(json!({ "success": true, "deleted": id })))
}

