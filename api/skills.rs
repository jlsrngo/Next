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

fn fallback_skills() -> serde_json::Value {
    json!([
        { "id": "1", "name": "TypeScript", "icon": "typescript", "iconName": "typescript", "category": "Languages", "proficiency": 92, "featured": true },
        { "id": "2", "name": "JavaScript", "icon": "javascript", "iconName": "javascript", "category": "Languages", "proficiency": 95, "featured": true },
        { "id": "3", "name": "Rust", "icon": "rust", "iconName": "rust", "category": "Languages", "proficiency": 88, "featured": true },
        { "id": "4", "name": "Python", "icon": "python", "iconName": "python", "category": "Languages", "proficiency": 85, "featured": true },
        { "id": "5", "name": "Go", "icon": "go", "iconName": "go", "category": "Languages", "proficiency": 80, "featured": false },
        { "id": "6", "name": "HTML5", "icon": "html5", "iconName": "html5", "category": "Languages", "proficiency": 98, "featured": false },
        { "id": "7", "name": "CSS3", "icon": "css3", "iconName": "css3", "category": "Languages", "proficiency": 95, "featured": false },

        { "id": "8", "name": "React", "icon": "react", "iconName": "react", "category": "Frontend", "proficiency": 94, "featured": true },
        { "id": "9", "name": "Next.js", "icon": "nextdotjs", "iconName": "nextdotjs", "category": "Frontend", "proficiency": 90, "featured": true },
        { "id": "10", "name": "Vite", "icon": "vite", "iconName": "vite", "category": "Frontend", "proficiency": 92, "featured": true },
        { "id": "11", "name": "Tailwind CSS", "icon": "tailwindcss", "iconName": "tailwindcss", "category": "Frontend", "proficiency": 96, "featured": true },
        { "id": "12", "name": "Svelte", "icon": "svelte", "iconName": "svelte", "category": "Frontend", "proficiency": 78, "featured": false },

        { "id": "13", "name": "Axum", "icon": "rust", "iconName": "rust", "category": "Backend", "proficiency": 88, "featured": true },
        { "id": "14", "name": "Node.js", "icon": "nodejs", "iconName": "nodejs", "category": "Backend", "proficiency": 92, "featured": true },
        { "id": "15", "name": "Express", "icon": "express", "iconName": "express", "category": "Backend", "proficiency": 90, "featured": false },
        { "id": "16", "name": "GraphQL", "icon": "graphql", "iconName": "graphql", "category": "Backend", "proficiency": 82, "featured": false },

        { "id": "17", "name": "PostgreSQL", "icon": "postgresql", "iconName": "postgresql", "category": "Database", "proficiency": 88, "featured": true },
        { "id": "18", "name": "Redis", "icon": "redis", "iconName": "redis", "category": "Database", "proficiency": 85, "featured": true },
        { "id": "19", "name": "SQLite", "icon": "sqlite", "iconName": "sqlite", "category": "Database", "proficiency": 90, "featured": false },
        { "id": "20", "name": "Prisma", "icon": "prisma", "iconName": "prisma", "category": "Database", "proficiency": 86, "featured": false },

        { "id": "21", "name": "Docker", "icon": "docker", "iconName": "docker", "category": "Tools & DevOps", "proficiency": 85, "featured": true },
        { "id": "22", "name": "Git", "icon": "git", "iconName": "git", "category": "Tools & DevOps", "proficiency": 94, "featured": true },
        { "id": "23", "name": "Linux", "icon": "linux", "iconName": "linux", "category": "Tools & DevOps", "proficiency": 88, "featured": true },
        { "id": "24", "name": "GitHub Actions", "icon": "githubactions", "iconName": "githubactions", "category": "Tools & DevOps", "proficiency": 84, "featured": false },
        { "id": "25", "name": "Nginx", "icon": "nginx", "iconName": "nginx", "category": "Tools & DevOps", "proficiency": 80, "featured": false },

        { "id": "26", "name": "Vercel", "icon": "vercel", "iconName": "vercel", "category": "Cloud", "proficiency": 92, "featured": true },
        { "id": "27", "name": "Cloudflare", "icon": "cloudflare", "iconName": "cloudflare", "category": "Cloud", "proficiency": 85, "featured": false },
        { "id": "28", "name": "AWS", "icon": "aws", "iconName": "aws", "category": "Cloud", "proficiency": 78, "featured": false }
    ])
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let database_url = env::var("DATABASE_URL").unwrap_or_default();

    if database_url.is_empty() {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .body(Body::Text(fallback_skills().to_string()))?);
    }

    match PgPool::connect(&database_url).await {
        Ok(pool) => {
            let skills = sqlx::query_as::<_, SkillRecord>(
                "SELECT id, name, category, icon_name, proficiency, featured, \"order\" FROM skills ORDER BY \"order\" ASC"
            )
            .fetch_all(&pool)
            .await;

            match skills {
                Ok(items) if !items.is_empty() => Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .header("Access-Control-Allow-Origin", "*")
                    .body(Body::Text(json!(items).to_string()))?),
                _ => Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .header("Access-Control-Allow-Origin", "*")
                    .body(Body::Text(fallback_skills().to_string()))?),
            }
        }
        Err(_) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .body(Body::Text(fallback_skills().to_string()))?),
    }
}
