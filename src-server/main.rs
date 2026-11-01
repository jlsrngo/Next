mod routes;
mod state;

use axum::http::{header, Method};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

use state::AppState;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").unwrap_or_default();
    println!(">>> [Rust Axum Engine] Connecting to Database...");

    let pool = if !database_url.is_empty() {
        match PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
        {
            Ok(p) => {
                println!(">>> [Rust Axum Engine] PostgreSQL Database Connected Successfully!");
                Some(p)
            }
            Err(e) => {
                eprintln!(">>> [Rust Axum Engine] DB Connection warning: {}", e);
                None
            }
        }
    } else {
        println!(">>> [Rust Axum Engine] DATABASE_URL not set, operating with synced snapshot.");
        None
    };

    let http_client = reqwest::Client::builder()
        .user_agent("Portfolio-Axum/1.0")
        .build()
        .unwrap_or_default();

    let state = Arc::new(AppState {
        pool,
        http_client,
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);

    let app = routes::create_router(state).layer(cors);

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!(">>> [Rust Axum Engine] Running on http://{}", addr);

    // Background asynchronous sync worker for telemetry
    tokio::spawn(async {
        let _ = tokio::process::Command::new("node").arg("scripts/sync-github.cjs").output().await;
        let _ = tokio::process::Command::new("node").arg("scripts/sync-trending.cjs").output().await;
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(1800)).await;
            let _ = tokio::process::Command::new("node").arg("scripts/sync-github.cjs").output().await;
            let _ = tokio::process::Command::new("node").arg("scripts/sync-trending.cjs").output().await;
        }
    });

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
