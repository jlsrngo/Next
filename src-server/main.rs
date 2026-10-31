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
        ])),
    )
}

async fn about_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "experiences": [
                {
                    "id": 1,
                    "company_name": "Independent Engineering & Systems",
                    "company_logo_url": null,
                    "position": "Lead Full-Stack Web Developer",
                    "location": "Remote / Indonesia",
                    "start_date": "2023-01-01",
                    "end_date": null,
                    "is_current": true,
                    "employment_type": "Full-time",
                    "work_type": "Remote",
                    "responsibilities": [
                        "Architecting ultra-high-performance web systems using Vite, React 18, and Rust Axum microservices",
                        "Migrating legacy Next.js runtimes to sub-millisecond asynchronous Rust Tokio web services",
                        "Designing Swiss Technical Brutalism UI design systems with precision hairline grids and HUD telemetry"
                    ],
                    "what_i_learned": [
                        "Asynchronous concurrency patterns with Tokio, Serde zero-copy deserialization, and Axum routing",
                        "Zero-runtime CSS architecture and technical typography systems"
                    ],
                    "impact": [
                        "Reduced frontend bundle size by 85% and cut API response latency to under 5ms",
                        "Achieved 100/100 performance scores across mobile and desktop Lighthouse audits"
                    ]
                },
                {
                    "id": 2,
                    "company_name": "Digital Application Engineering Lab",
                    "company_logo_url": null,
                    "position": "Full-Stack Web Developer",
                    "location": "Indonesia",
                    "start_date": "2022-01-01",
                    "end_date": "2022-12-31",
                    "is_current": false,
                    "employment_type": "Contract",
                    "work_type": "Hybrid",
                    "responsibilities": [
                        "Developed high-traffic responsive web applications using React, TypeScript, and PostgreSQL",
                        "Integrated third-party APIs and implemented secure JWT / OAuth authentication workflows",
                        "Collaborated in agile cross-functional engineering teams delivering enterprise-grade software"
                    ],
                    "what_i_learned": [
                        "Relational database query optimization and PostgreSQL indexing strategies",
                        "Advanced React state management architectures and component performance tuning"
                    ],
                    "impact": [
                        "Delivered 12+ mission-critical web applications with zero production downtime",
                        "Improved application page load speeds by 40% through code splitting and asset optimization"
                    ]
                },
                {
                    "id": 3,
                    "company_name": "Open-Source Web & Systems Community",
                    "company_logo_url": null,
                    "position": "Software Engineer & Open Source Contributor",
                    "location": "Global / Remote",
                    "start_date": "2021-03-01",
                    "end_date": "2021-12-31",
                    "is_current": false,
                    "employment_type": "Open Source",
                    "work_type": "Remote",
                    "responsibilities": [
                        "Authored modular open-source developer tooling and reusable UI component primitives",
                        "Reviewed community pull requests and benchmarked asynchronous network protocols"
                    ],
                    "what_i_learned": [
                        "Open-source software governance, automated CI/CD pipelines, and semantic versioning",
                        "Deep insights into low-level systems programming and compiler optimizations"
                    ],
                    "impact": [
                        "Published libraries and technical developer resources utilized by hundreds of engineers"
                    ]
                }
            ],
            "educations": [
                {
                    "id": 1,
                    "institution_name": "University / Institute of Technology",
                    "institution_logo_url": null,
                    "degree": "Bachelor of Computer Science (S.Kom)",
                    "field_of_study": "Informatics & Software Engineering",
                    "location": "Indonesia",
                    "gpa": "3.85 / 4.00 (Cum Laude)",
                    "start_date": "2020-09-01",
                    "end_date": "2024-07-01",
                    "is_current": false,
                    "description": "Specialized in distributed systems, web architectures, algorithms, and database systems optimization."
                },
                {
                    "id": 2,
                    "institution_name": "Systems Architecture & Cloud Institute",
                    "institution_logo_url": null,
                    "degree": "Professional Certification",
                    "field_of_study": "High-Concurrency Web Systems & Rust Programming",
                    "location": "Online / Global",
                    "gpa": null,
                    "start_date": "2023-05-01",
                    "end_date": "2023-11-01",
                    "is_current": false,
                    "description": "Intensive mastery in microservice patterns, containerized deployments, and high-performance network engineering."
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
