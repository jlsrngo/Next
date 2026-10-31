use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use std::env;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct ProjectRecord {
    id: String,
    title: String,
    description: String,
    image_url: Option<String>,
    live_url: Option<String>,
    github_url: Option<String>,
    tech_stack: Vec<String>,
    featured: bool,
    order: i32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

fn fallback_projects() -> serde_json::Value {
    json!([
        {
            "id": "1",
            "title": "Portfolio ArtCraft System",
            "description": "High-performance portfolio built with Swiss wireframe editorial brutalism, accelerated with Rust and Axum.",
            "image_url": "/projects/artcraft.png",
            "live_url": "https://getartcraft.com",
            "github_url": "https://github.com/jlsrngo/Next",
            "tech_stack": ["Rust", "Axum", "React", "Vite", "Tailwind CSS"],
            "featured": true,
            "order": 1
        },
        {
            "id": "2",
            "title": "Arunaki Editorial Platform",
            "description": "Monochrome architectural editorial platform inspired by Swiss typographic posters and modernist brutalism.",
            "image_url": "/projects/arunaki.png",
            "live_url": "https://arunaki.com",
            "github_url": "https://github.com/jlsrngo/Next",
            "tech_stack": ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
            "featured": true,
            "order": 2
        }
    ])
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let database_url = env::var("DATABASE_URL").unwrap_or_default();

    if database_url.is_empty() {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .body(Body::Text(fallback_projects().to_string()))?);
    }

    match PgPool::connect(&database_url).await {
        Ok(pool) => {
            let projects = sqlx::query_as::<_, ProjectRecord>(
                "SELECT id, title, description, image_url, live_url, github_url, tech_stack, featured, \"order\" FROM projects ORDER BY \"order\" ASC"
            )
            .fetch_all(&pool)
            .await;

            match projects {
                Ok(items) if !items.is_empty() => Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .header("Access-Control-Allow-Origin", "*")
                    .body(Body::Text(json!(items).to_string()))?),
                _ => Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .header("Access-Control-Allow-Origin", "*")
                    .body(Body::Text(fallback_projects().to_string()))?),
            }
        }
        Err(_) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .body(Body::Text(fallback_projects().to_string()))?),
    }
}
