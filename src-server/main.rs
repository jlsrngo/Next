use axum::{
    extract::Query,
    http::{header, Method, StatusCode},
    response::{IntoResponse, Json},
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Debug, Serialize, Deserialize)]
struct LocaleQuery {
    locale: Option<String>,
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);

    let app = Router::new()
        .route("/api/health", get(health_handler))
        .route("/api/stats", get(stats_handler))
        .route("/api/dashboard", get(dashboard_handler))
        .route("/api/profile", get(profile_handler))
        .route("/api/projects", get(projects_handler))
        .route("/api/skills", get(skills_handler))
        .route("/api/about", get(about_handler))
        .route("/api/github/contributions", get(github_contributions_handler))
        .layer(cors);

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!(">>> [Rust Axum Engine] Running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "status": "healthy",
            "engine": "Rust / Axum 0.7",
            "runtime": "Tokio Async",
            "uptime_ms": 10
        })),
    )
}

async fn stats_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "engine": "Axum 0.7 (Rust Native)",
            "status": "optimal",
            "memory_usage_mb": 14.2,
            "cold_start_ms": 1,
            "architecture": "x86_64-pc-windows-msvc"
        })),
    )
}

async fn dashboard_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "total_projects": 2,
            "featured_projects": 2,
            "total_achievements": 2,
            "total_contributions": 1656,
            "total_repos": 17,
            "total_prs": 0,
            "followers": 0
        })),
    )
}

async fn profile_handler(_q: Query<LocaleQuery>) -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "name": "Julio Siringoringo",
            "fullName": "Julio Siringoringo",
            "username": "jlsrngo",
            "headline": "Junior Full-Stack Web Developer",
            "bio_home": "I am a web developer with expertise in building fast, scalable applications using modern technologies.",
            "bio_about": "Passionate developer focused on high-performance web systems, Swiss brutalist aesthetics, and robust software architecture.",
            "location": "Indonesia",
            "work_status": "Open to Opportunities",
            "avatar_url": "/avatar.jpg",
            "github_url": "https://github.com/jlsrngo",
            "linkedin_url": "https://linkedin.com/in/jlsrngo",
            "email": "juliosiringo777@gmail.com",
            "website": "https://jlsrngo.com",
            "accent_color": "#2d81ff"
        })),
    )
}

async fn projects_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!([
            {
                "id": "1",
                "title": "Portfolio ArtCraft System",
                "description": "High-performance portfolio built with Swiss wireframe editorial brutalism, accelerated with Rust and Axum.",
                "image_url": "/projects/artcraft.png",
                "live_url": "https://getartcraft.com",
                "github_url": "https://github.com/jlsrngo/Next",
                "tech_stack": ["Rust", "Axum", "React", "Vite", "Tailwind CSS"],
                "featured": true,
                "order_index": 0
            },
            {
                "id": "2",
                "title": "Arunaki Engine Docs",
                "description": "Documentation and developer hub for the Arunaki CLI system and workflow tools.",
                "image_url": null,
                "live_url": "/arunaki/docs",
                "github_url": "https://github.com/jlsrngo",
                "tech_stack": ["Next.js", "TypeScript", "Tailwind CSS", "Rust"],
                "featured": true,
                "order_index": 1
            }
        ])),
    )
}

async fn skills_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!([
            { "id": "1", "name": "TypeScript", "icon": "typescript", "iconName": "typescript", "category": "Languages", "proficiency": 90, "featured": true },
            { "id": "2", "name": "Rust", "icon": "rust", "iconName": "rust", "category": "Languages", "proficiency": 90, "featured": true },
            { "id": "3", "name": "React", "icon": "react", "iconName": "react", "category": "Frontend", "proficiency": 92, "featured": true },
            { "id": "4", "name": "Next.js", "icon": "nextdotjs", "iconName": "nextdotjs", "category": "Frontend", "proficiency": 88, "featured": true },
            { "id": "5", "name": "Tailwind CSS", "icon": "tailwindcss", "iconName": "tailwindcss", "category": "Frontend", "proficiency": 95, "featured": true },
            { "id": "6", "name": "Axum", "icon": "rust", "iconName": "rust", "category": "Backend", "proficiency": 88, "featured": true },
            { "id": "7", "name": "PostgreSQL", "icon": "postgresql", "iconName": "postgresql", "category": "Database", "proficiency": 85, "featured": true },
            { "id": "8", "name": "Docker", "icon": "docker", "iconName": "docker", "category": "Tools & DevOps", "proficiency": 80, "featured": false }
        ])),
    )
}

async fn about_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "experiences": [
                {
                    "id": "1",
                    "role": "Full-Stack Web Developer",
                    "company": "Independent Engineering",
                    "period": "2023 - Present",
                    "description": "Architecting ultra-fast web applications, migrating legacy runtimes to Rust, designing Swiss technical UI design systems.",
                    "tags": ["Rust", "Axum", "React", "Vite", "PostgreSQL"]
                }
            ],
            "educations": [
                {
                    "id": "1",
                    "degree": "Informatics Engineering",
                    "institution": "University / Institute",
                    "period": "2020 - 2024",
                    "description": "Focused on software engineering, algorithm design, distributed computing, and web architectures."
                }
            ]
        })),
    )
}

async fn github_contributions_handler() -> impl IntoResponse {
    // Generates a mock/cached 52-week calendar with realistic levels
    let mut weeks = Vec::new();
    let total_weeks = 52;
    for w in 0..total_weeks {
        let mut days = Vec::new();
        for d in 0..7 {
            let count = if w > 35 && (w + d) % 2 == 0 { (w % 6) + 1 } else { 0 };
            let level = match count {
                0 => 0,
                1..=2 => 1,
                3..=4 => 2,
                5..=7 => 3,
                _ => 4,
            };
            days.push(json!({
                "date": format!("2026-{:02}-{:02}", (w / 4) + 1, (d * 4) + 1),
                "count": count,
                "level": level
            }));
        }
        weeks.push(days);
    }

    (
        StatusCode::OK,
        Json(json!({
            "username": "jlsrngo",
            "total_contributions": 1656,
            "total_repos": 17,
            "total_prs": 0,
            "followers": 0,
            "weeks": weeks,
            "top_languages": [
                { "name": "TypeScript", "color": "#3178c6", "count": 4 },
                { "name": "HTML", "color": "#e34c26", "count": 4 },
                { "name": "Python", "color": "#3572A5", "count": 2 },
                { "name": "CSS", "color": "#563d7c", "count": 2 },
                { "name": "JavaScript", "color": "#f1e05a", "count": 1 },
                { "name": "C++", "color": "#f34b7d", "count": 1 },
                { "name": "Rust", "color": "#dea584", "count": 1 }
            ]
        })),
    )
}
