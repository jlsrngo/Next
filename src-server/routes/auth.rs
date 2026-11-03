use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::{json, Value};
use sqlx::Row;
use crate::state::SharedState;

pub async fn login_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let email = payload.get("email").and_then(|v| v.as_str()).unwrap_or("").trim().to_lowercase();
    let password = payload.get("password").and_then(|v| v.as_str()).unwrap_or("");

    if email.is_empty() || password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({ "ok": false, "error": "Email and password required" })),
        );
    }

    if let Some(pool) = &state.pool {
        let row = sqlx::query(
            "SELECT id, email, password_hash, role FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1"
        )
        .bind(&email)
        .fetch_optional(pool)
        .await;

        if let Ok(Some(u)) = row {
            let pwd_hash: String = u.try_get("password_hash").unwrap_or_default();
            let role: String = u.try_get("role").unwrap_or_else(|_| "admin".to_string());
            let user_email: String = u.try_get("email").unwrap_or_else(|_| email.clone());
            let user_id: String = u.try_get("id").unwrap_or_default();

            // Verify using PostgreSQL pgcrypto crypt() if available
            let check = sqlx::query("SELECT ($1 = crypt($2, $1)) AS is_valid")
                .bind(&pwd_hash)
                .bind(password)
                .fetch_optional(pool)
                .await;

            if let Ok(Some(check_row)) = check {
                let is_valid: bool = check_row.try_get("is_valid").unwrap_or(false);
                if is_valid {
                    return (
                        StatusCode::OK,
                        Json(json!({
                            "ok": true,
                            "user": {
                                "id": user_id,
                                "email": user_email,
                                "role": role
                            }
                        })),
                    );
                }
            }
        }
    }

    // Fallback credentials
    if (email == "admin@portfolio.com" || email == "juliosiringoringo6@gmail.com")
        && password == "admin123"
    {
        return (
            StatusCode::OK,
            Json(json!({
                "ok": true,
                "user": {
                    "id": "1",
                    "email": email,
                    "role": "admin"
                }
            })),
        );
    }

    (
        StatusCode::UNAUTHORIZED,
        Json(json!({ "ok": false, "error": "Invalid email or password" })),
    )
}

pub async fn update_auth_handler(
    State(state): State<SharedState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let email = payload.get("email").and_then(|v| v.as_str()).unwrap_or("").trim().to_lowercase();
    let new_password = payload.get("newPassword").or_else(|| payload.get("new_password")).and_then(|v| v.as_str());

    if let Some(pool) = &state.pool {
        if let Some(new_pwd) = new_password {
            if !new_pwd.trim().is_empty() {
                let _ = sqlx::query(
                    "UPDATE users SET email = $1, password_hash = crypt($2, gen_salt('bf', 12)), updated_at = NOW() WHERE id IN (SELECT id FROM users LIMIT 1)"
                )
                .bind(&email)
                .bind(new_pwd.trim())
                .execute(pool)
                .await;
            }
        } else if !email.is_empty() {
            let _ = sqlx::query(
                "UPDATE users SET email = $1, updated_at = NOW() WHERE id IN (SELECT id FROM users LIMIT 1)"
            )
            .bind(&email)
            .execute(pool)
            .await;
        }
    }

    (
        StatusCode::OK,
        Json(json!({ "ok": true, "email": email })),
    )
}
