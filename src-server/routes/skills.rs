use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, get_snapshot, SharedState};

#[derive(Debug, Serialize, Deserialize)]
pub struct SkillQuery {
    pub id: Option<String>,
    #[serde(rename = "iconName")]
    pub icon_name: Option<String>,
}

pub async fn skills_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, name, category, icon_name, proficiency, featured, \"order\" FROM skills ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let name: String = r.try_get("name").unwrap_or_default();
                let category: String = r.try_get("category").unwrap_or_default();
                let icon_name: Option<String> = r.try_get("icon_name").ok();
                let proficiency: i32 = r.try_get("proficiency").unwrap_or(80);
                let featured: bool = r.try_get("featured").unwrap_or(false);
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "name": name,
                    "category": category,
                    "icon": icon_name,
                    "iconName": icon_name,
                    "proficiency": proficiency,
                    "featured": featured,
                    "order": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }

    if let Some(snap) = get_snapshot() {
        if let Some(skills) = snap.get("skills") {
            return (StatusCode::OK, Json(skills.clone()));
        }
    }

    (StatusCode::OK, Json(json!([])))
}

pub async fn create_skill_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("skill");
    let name = payload.get("name").and_then(|v| v.as_str()).unwrap_or("New Skill");
    let category = payload.get("category").and_then(|v| v.as_str()).unwrap_or("Tools & DevOps");
    let icon_name = payload.get("iconName").or_else(|| payload.get("icon_name")).and_then(|v| v.as_str()).unwrap_or(name);
    let proficiency = payload.get("proficiency").and_then(|v| v.as_i64()).unwrap_or(80) as i32;
    let featured = payload.get("featured").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            INSERT INTO skills (id, name, category, icon_name, proficiency, featured, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT (id) DO NOTHING
            "#
        )
        .bind(&id)
        .bind(name)
        .bind(category)
        .bind(icon_name)
        .bind(proficiency)
        .bind(featured)
        .bind(order)
        .execute(pool)
        .await;
    }

    (StatusCode::CREATED, Json(json!({
        "id": id,
        "name": name,
        "category": category,
        "iconName": icon_name,
        "proficiency": proficiency,
        "featured": featured,
        "order": order
    })))
}

pub async fn delete_skill_handler(
    State(state): State<SharedState>,
    Query(query): Query<SkillQuery>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Some(id) = &query.id {
            let _ = sqlx::query("DELETE FROM skills WHERE id = $1").bind(id).execute(pool).await;
        } else if let Some(icon) = &query.icon_name {
            let _ = sqlx::query("DELETE FROM skills WHERE icon_name = $1 OR lower(name) = lower($1)").bind(icon).execute(pool).await;
        }
    }
    (StatusCode::OK, Json(json!({ "success": true })))
}
