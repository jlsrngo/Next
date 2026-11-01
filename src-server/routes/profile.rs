use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::{get_snapshot, SharedState};

#[derive(Debug, Serialize, Deserialize)]
pub struct LocaleQuery {
    pub locale: Option<String>,
}

pub async fn profile_handler(
    State(state): State<SharedState>,
    _q: axum::extract::Query<LocaleQuery>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        let query_result = sqlx::query(
            "SELECT id, full_name, headline, bio_home, bio_about, avatar_url, accent_color, email, phone, location, website, github_url, linkedin_url FROM profiles LIMIT 1"
        )
        .fetch_one(pool)
        .await;

        if let Ok(row) = query_result {
            let full_name: String = row.try_get("full_name").unwrap_or_else(|_| "Julio Siringoringo".to_string());
            let headline: Option<String> = row.try_get("headline").ok();
            let bio_home: Option<String> = row.try_get("bio_home").ok();
            let bio_about: Option<String> = row.try_get("bio_about").ok();
            let avatar_url: Option<String> = row.try_get("avatar_url").ok();
            let accent_color: String = row.try_get("accent_color").unwrap_or_else(|_| "#3B82F6".to_string());
            let email: Option<String> = row.try_get("email").ok();
            let phone: Option<String> = row.try_get("phone").ok();
            let location: Option<String> = row.try_get("location").ok();
            let website: Option<String> = row.try_get("website").ok();
            let github_url: Option<String> = row.try_get("github_url").ok();
            let linkedin_url: Option<String> = row.try_get("linkedin_url").ok();

            return (
                StatusCode::OK,
                Json(json!({
                    "name": full_name,
                    "fullName": full_name,
                    "username": "jlsrngo",
                    "headline": headline.clone().unwrap_or_else(|| "Full Stack Developer".to_string()),
                    "focus": headline.unwrap_or_else(|| "Full-Stack & Systems".to_string()),
                    "runtime": "Rust Axum 0.7 · React 18 · Tokio Native".to_string(),
                    "bio_home": bio_home.clone().unwrap_or_default(),
                    "bio_about": bio_about.clone().unwrap_or_default(),
                    "bioHome": bio_home.unwrap_or_default(),
                    "bioAbout": bio_about.unwrap_or_default(),
                    "location": location.unwrap_or_else(|| "Indonesia".to_string()),
                    "phone": phone.unwrap_or_default(),
                    "work_status": "Open to Opportunities",
                    "avatar_url": avatar_url.clone().unwrap_or_else(|| "/avatar.jpg".to_string()),
                    "avatarUrl": avatar_url.unwrap_or_else(|| "/avatar.jpg".to_string()),
                    "github_url": github_url.unwrap_or_else(|| "https://github.com/jlsrngo".to_string()),
                    "linkedin_url": linkedin_url.unwrap_or_else(|| "https://linkedin.com/in/jlsrngo".to_string()),
                    "email": email.unwrap_or_else(|| "juliosiringo777@gmail.com".to_string()),
                    "website": website.unwrap_or_else(|| "https://jlsrngo.com".to_string()),
                    "accent_color": accent_color
                })),
            );
        }
    }

    if let Some(snap) = get_snapshot() {
        if let Some(p) = snap.get("profile") {
            return (StatusCode::OK, Json(p.clone()));
        }
    }

    (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Profile not found" })))
}

pub async fn update_profile_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let full_name = payload.get("fullName").or_else(|| payload.get("full_name")).and_then(|v| v.as_str()).unwrap_or("Julio Siringoringo");
    let headline = payload.get("headline").and_then(|v| v.as_str());
    let bio_home = payload.get("bioHome").or_else(|| payload.get("bio_home")).and_then(|v| v.as_str());
    let bio_about = payload.get("bioAbout").or_else(|| payload.get("bio_about")).and_then(|v| v.as_str());
    let avatar_url = payload.get("avatarUrl").or_else(|| payload.get("avatar_url")).and_then(|v| v.as_str());
    let email = payload.get("email").and_then(|v| v.as_str());
    let phone = payload.get("phone").and_then(|v| v.as_str());
    let location = payload.get("location").and_then(|v| v.as_str());
    let website = payload.get("website").and_then(|v| v.as_str());
    let github_url = payload.get("githubUrl").or_else(|| payload.get("github_url")).and_then(|v| v.as_str());
    let linkedin_url = payload.get("linkedinUrl").or_else(|| payload.get("linkedin_url")).and_then(|v| v.as_str());

    if let Some(pool) = &state.pool {
        let _ = sqlx::query(
            r#"
            UPDATE profiles 
            SET full_name = $1, headline = $2, bio_home = $3, bio_about = $4,
                avatar_url = COALESCE($5, avatar_url), email = $6, phone = $7,
                location = $8, website = $9, github_url = $10, linkedin_url = $11,
                updated_at = NOW()
            WHERE id IN (SELECT id FROM profiles LIMIT 1)
            "#
        )
        .bind(full_name)
        .bind(headline)
        .bind(bio_home)
        .bind(bio_about)
        .bind(avatar_url)
        .bind(email)
        .bind(phone)
        .bind(location)
        .bind(website)
        .bind(github_url)
        .bind(linkedin_url)
        .execute(pool)
        .await;
    }

    (StatusCode::OK, Json(json!({ "success": true, "message": "Profile updated successfully" })))
}
