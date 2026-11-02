use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{generate_id, SharedState};

pub async fn education_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, institution, degree, institution_logo_url, field_of_study, location, gpa, start_date::text as start_date, end_date::text as end_date, current, description, \"order\" FROM educations ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        if let Ok(rows) = query_result {
            let mut list = Vec::new();
            for r in rows {
                let id: String = r.try_get("id").unwrap_or_default();
                let institution: String = r.try_get("institution").unwrap_or_default();
                let degree: String = r.try_get("degree").unwrap_or_default();
                let institution_logo_url: Option<String> = r.try_get("institution_logo_url").ok();
                let field: Option<String> = r.try_get("field_of_study").ok();
                let location: Option<String> = r.try_get("location").ok();
                let gpa: Option<String> = r.try_get("gpa").ok();
                let start_date: Option<String> = r.try_get("start_date").ok();
                let end_date: Option<String> = r.try_get("end_date").ok();
                let current: bool = r.try_get("current").unwrap_or(false);
                let description: Option<String> = r.try_get("description").ok();
                let order: i32 = r.try_get("order").unwrap_or(0);

                list.push(json!({
                    "id": id,
                    "institution": institution,
                    "degree": degree,
                    "institutionLogoUrl": institution_logo_url,
                    "institution_logo_url": institution_logo_url,
                    "fieldOfStudy": field,
                    "location": location,
                    "grade": gpa,
                    "startDate": start_date,
                    "endDate": end_date,
                    "current": current,
                    "description": description.unwrap_or_default(),
                    "order": order
                }));
            }
            return (StatusCode::OK, Json(json!(list)));
        }
    }
    (StatusCode::OK, Json(json!([])))
}

pub async fn create_education_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let id = generate_id("edu");
    let institution = payload.get("institution").and_then(|v| v.as_str()).unwrap_or("University");
    let degree = payload.get("degree").and_then(|v| v.as_str()).unwrap_or("Degree");
    let institution_logo_url = payload.get("institutionLogoUrl").or_else(|| payload.get("institution_logo_url")).and_then(|v| v.as_str());
    let field = payload.get("fieldOfStudy").or_else(|| payload.get("field_of_study")).and_then(|v| v.as_str()).unwrap_or("Computer Science");
    let gpa = payload.get("grade").or_else(|| payload.get("gpa")).and_then(|v| v.as_str());
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let current = payload.get("current").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            INSERT INTO educations (id, institution, degree, institution_logo_url, field_of_study, gpa, start_date, end_date, current, description, "order")
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NULL, $7, $8, $9)
            "#
        )
        .bind(&id)
        .bind(institution)
        .bind(degree)
        .bind(institution_logo_url)
        .bind(field)
        .bind(gpa)
        .bind(current)
        .bind(description)
        .bind(order)
        .execute(pool)
        .await;
    }

    (StatusCode::CREATED, Json(json!({ "id": id, "institution": institution, "degree": degree })))
}

pub async fn update_education_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let institution = payload.get("institution").and_then(|v| v.as_str()).unwrap_or("University");
    let degree = payload.get("degree").and_then(|v| v.as_str()).unwrap_or("Degree");
    let institution_logo_url = payload.get("institutionLogoUrl").or_else(|| payload.get("institution_logo_url")).and_then(|v| v.as_str());
    let field = payload.get("fieldOfStudy").or_else(|| payload.get("field_of_study")).and_then(|v| v.as_str()).unwrap_or("Computer Science");
    let gpa = payload.get("grade").or_else(|| payload.get("gpa")).and_then(|v| v.as_str());
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let current = payload.get("current").and_then(|v| v.as_bool()).unwrap_or(false);
    let order = payload.get("order").and_then(|v| v.as_i64()).unwrap_or(0) as i32;

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            UPDATE educations
            SET institution = $1, degree = $2, institution_logo_url = $3, field_of_study = $4,
                gpa = $5, current = $6, description = $7, "order" = $8
            WHERE id = $9
            "#
        )
        .bind(institution)
        .bind(degree)
        .bind(institution_logo_url)
        .bind(field)
        .bind(gpa)
        .bind(current)
        .bind(description)
        .bind(order)
        .bind(&id)
        .execute(pool)
        .await;
    }

    (StatusCode::OK, Json(json!({ "success": true, "id": id })))
}

pub async fn delete_education_handler(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let _ = sqlx::query("DELETE FROM educations WHERE id = $1").bind(&id).execute(pool).await;
    }
    (StatusCode::OK, Json(json!({ "success": true, "deleted": id })))
}

