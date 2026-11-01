use serde_json::Value;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pool: Option<PgPool>,
    pub http_client: reqwest::Client,
}

pub type SharedState = Arc<AppState>;

pub fn generate_id(prefix: &str) -> String {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos();
    format!("{}_{}_{:x}", prefix, now, nanos % 0xffff)
}

pub fn get_snapshot() -> Option<Value> {
    if let Ok(content) = std::fs::read_to_string("public/db-data.json") {
        if let Ok(val) = serde_json::from_str::<Value>(&content) {
            return Some(val);
        }
    }
    None
}

