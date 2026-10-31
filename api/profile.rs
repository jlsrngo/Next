use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .header("Access-Control-Allow-Origin", "*")
        .body(Body::Text(
            json!({
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
            })
            .to_string(),
        ))?)
}
