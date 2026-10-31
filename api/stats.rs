use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[derive(Serialize, Deserialize)]
struct Stats {
    engine: &'static str,
    status: &'static str,
    memory_efficient: bool,
    cold_start_ms: u32,
    architecture: &'static str,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(_req: Request) -> Result<Response<Body>, Error> {
    let stats = Stats {
        engine: "Rust / vercel-rust runtime",
        status: "optimal",
        memory_efficient: true,
        cold_start_ms: 15,
        architecture: "x86_64 serverless binary",
    };

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .header("Cache-Control", "s-maxage=60, stale-while-revalidate")
        .body(Body::Text(json!(stats).to_string()))?)
}
