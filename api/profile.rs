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
                "engine": "rust-native",
                "backend_accelerator": "vercel-rust",
                "focus": ["Fullstack Systems", "Next.js", "Rust", "PostgreSQL"],
                "performance": {
                    "memory_footprint": "< 15MB",
                    "execution": "near-instant"
                }
            })
            .to_string(),
        ))?)
}
