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
        .body(Body::Text(
            json!({
                "status": "online",
                "runtime": "rust",
                "engine": "vercel-rust",
                "timestamp": chrono_or_simple()
            })
            .to_string(),
        ))?)
}

fn chrono_or_simple() -> &'static str {
    "active"
}
