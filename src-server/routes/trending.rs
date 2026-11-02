use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::{json, Value};
use crate::state::{get_snapshot, SharedState};

pub async fn about_handler(State(state): State<SharedState>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let exp_rows = sqlx::query(
            "SELECT id, company, position, company_logo_url, location, start_date::text as start_date, end_date::text as end_date, current, description, \"order\" FROM work_experiences ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        let edu_rows = sqlx::query(
            "SELECT id, institution, degree, institution_logo_url, field_of_study, location, gpa, start_date::text as start_date, end_date::text as end_date, current, description, \"order\" FROM educations ORDER BY \"order\" ASC"
        )
        .fetch_all(pool)
        .await;

        let mut experiences = Vec::new();
        if let Ok(rows) = exp_rows {
            for r in rows {
                use sqlx::Row;
                let id: String = r.try_get("id").unwrap_or_default();
                let company: String = r.try_get("company").unwrap_or_default();
                let position: String = r.try_get("position").unwrap_or_default();
                let company_logo_url: Option<String> = r.try_get("company_logo_url").ok();
                let location: Option<String> = r.try_get("location").ok();
                let start_date: Option<String> = r.try_get("start_date").ok();
                let end_date: Option<String> = r.try_get("end_date").ok();
                let current: bool = r.try_get("current").unwrap_or(false);
                let description: String = r.try_get("description").unwrap_or_default();

                experiences.push(json!({
                    "id": id,
                    "company_name": company,
                    "company": company,
                    "company_logo_url": company_logo_url,
                    "companyLogoUrl": company_logo_url,
                    "position": position,
                    "location": location.unwrap_or_else(|| "Indonesia".to_string()),
                    "start_date": start_date.clone().unwrap_or_else(|| "2023-01-01".to_string()),
                    "startDate": start_date.unwrap_or_else(|| "2023-01-01".to_string()),
                    "end_date": end_date,
                    "endDate": end_date,
                    "is_current": current,
                    "current": current,
                    "description": description
                }));
            }
        }

        let mut education = Vec::new();
        if let Ok(rows) = edu_rows {
            for r in rows {
                use sqlx::Row;
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

                education.push(json!({
                    "id": id,
                    "institution": institution,
                    "degree": degree,
                    "institution_logo_url": institution_logo_url,
                    "institutionLogoUrl": institution_logo_url,
                    "field_of_study": field,
                    "fieldOfStudy": field,
                    "location": location.unwrap_or_else(|| "Indonesia".to_string()),
                    "gpa": gpa,
                    "grade": gpa,
                    "start_date": start_date.clone().unwrap_or_else(|| "2020-01-01".to_string()),
                    "startDate": start_date.unwrap_or_else(|| "2020-01-01".to_string()),
                    "end_date": end_date,
                    "endDate": end_date,
                    "is_current": current,
                    "current": current,
                    "description": description.unwrap_or_default()
                }));
            }
        }

        return (
            StatusCode::OK,
            Json(json!({
                "experiences": experiences,
                "education": education
            })),
        );
    }

    if let Some(snap) = get_snapshot() {
        if let Some(about) = snap.get("about") {
            return (StatusCode::OK, Json(about.clone()));
        }
    }

    (
        StatusCode::OK,
        Json(json!({ "experiences": [], "education": [] })),
    )
}

pub async fn trending_handler(State(_state): State<SharedState>) -> impl IntoResponse {
    if let Ok(content) = std::fs::read_to_string("public/trending-tech.json") {
        if let Ok(val) = serde_json::from_str::<Value>(&content) {
            return (StatusCode::OK, Json(val));
        }
    }

    (
        StatusCode::OK,
        Json(json!({
            "status": "LIVE_SYNC",
            "source": "GitHub Search API",
            "headline": "Autonomous AI & Rust Systems Architecture",
            "metric": "▲ 240 PTS",
            "spec": "TECH WIRE // LIVE: Autonomous AI & Rust Systems Architecture",
            "viral_repo": "openclaw/openclaw",
            "repo_metric": "★ 393.6k",
            "repo_spec": "VIRAL REPO // openclaw/openclaw"
        })),
    )
}

