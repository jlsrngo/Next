use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use std::env;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct SkillRecord {
    id: String,
    name: String,
    category: String,
    icon_name: Option<String>,
    proficiency: i32,
    featured: bool,
    order: i32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let database_url = env::var("DATABASE_URL").unwrap_or_default();

    if database_url.is_empty() {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::Text(json!([]).to_string()))?);
    }

    match PgPool::connect(&database_url).await {
        Ok(pool) => {
            let skills = sqlx::query_as::<_, SkillRecord>(
                "SELECT id, name, category, icon_name, proficiency, featured, \"order\" FROM skills ORDER BY \"order\" ASC"
            )
            .fetch_all(&pool)
            .await;

            match skills {
                Ok(items) => Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .header("Cache-Control", "s-maxage=60, stale-while-revalidate")
                    .body(Body::Text(json!(items).to_string()))?),
                Err(e) => Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .body(Body::Text(json!({ "error": e.to_string() }).to_string()))?),
            }
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(Body::Text(json!({ "error": e.to_string() }).to_string()))?),
    }
}
