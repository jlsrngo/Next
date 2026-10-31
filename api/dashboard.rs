use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use std::env;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[derive(Serialize, Deserialize)]
struct DashboardData {
    total_projects: i64,
    featured_projects: i64,
    total_achievements: i64,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let database_url = env::var("DATABASE_URL").unwrap_or_default();

    if database_url.is_empty() {
        let fallback = DashboardData {
            total_projects: 0,
            featured_projects: 0,
            total_achievements: 0,
        };
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::Text(json!(fallback).to_string()))?);
    }

    match PgPool::connect(&database_url).await {
        Ok(pool) => {
            let total_proj: (i64,) = sqlx::query_as("SELECT count(*) FROM projects")
                .fetch_one(&pool)
                .await
                .unwrap_or((0,));

            let featured_proj: (i64,) = sqlx::query_as("SELECT count(*) FROM projects WHERE featured = true")
                .fetch_one(&pool)
                .await
                .unwrap_or((0,));

            let total_achieve: (i64,) = sqlx::query_as("SELECT count(*) FROM achievements")
                .fetch_one(&pool)
                .await
                .unwrap_or((0,));

            let data = DashboardData {
                total_projects: total_proj.0,
                featured_projects: featured_proj.0,
                total_achievements: total_achieve.0,
            };

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .header("Cache-Control", "s-maxage=60, stale-while-revalidate")
                .body(Body::Text(json!(data).to_string()))?)
        }
        Err(_) => {
            let fallback = DashboardData {
                total_projects: 0,
                featured_projects: 0,
                total_achievements: 0,
            };
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(Body::Text(json!(fallback).to_string()))?)
        }
    }
}
