pub mod achievements;
pub mod dashboard;
pub mod education;
pub mod experiences;
pub mod health;
pub mod profile;
pub mod projects;
pub mod skills;
pub mod social_links;
pub mod trending;

use axum::{
    routing::{get, put},
    Router,
};
use crate::state::SharedState;

pub fn create_router(state: SharedState) -> Router {
    Router::new()
        // System & Diagnostics
        .route("/api/health", get(health::health_handler))
        .route("/api/stats", get(health::stats_handler))
        .route("/api/dashboard", get(dashboard::dashboard_handler))
        .route("/api/github/contributions", get(dashboard::github_contributions_handler))
        .route("/api/trending", get(trending::trending_handler))
        .route("/api/about", get(trending::about_handler))
        // Operator Profile CRUD
        .route(
            "/api/profile",
            get(profile::profile_handler)
                .put(profile::update_profile_handler)
                .post(profile::update_profile_handler),
        )
        // Projects CRUD
        .route(
            "/api/projects",
            get(projects::projects_handler).post(projects::create_project_handler),
        )
        .route(
            "/api/projects/:id",
            put(projects::update_project_handler).delete(projects::delete_project_handler),
        )
        // Skills CRUD
        .route(
            "/api/skills",
            get(skills::skills_handler)
                .post(skills::create_skill_handler)
                .delete(skills::delete_skill_handler),
        )
        // Achievements CRUD
        .route(
            "/api/achievements",
            get(achievements::achievements_handler).post(achievements::create_achievement_handler),
        )
        .route(
            "/api/achievements/:id",
            put(achievements::update_achievement_handler)
                .delete(achievements::delete_achievement_handler),
        )
        // Experiences CRUD
        .route(
            "/api/experiences",
            get(experiences::experiences_handler).post(experiences::create_experience_handler),
        )
        .route(
            "/api/experiences/:id",
            put(experiences::update_experience_handler)
                .delete(experiences::delete_experience_handler),
        )
        // Education CRUD
        .route(
            "/api/education",
            get(education::education_handler).post(education::create_education_handler),
        )
        .route(
            "/api/education/:id",
            put(education::update_education_handler).delete(education::delete_education_handler),
        )
        // Social Links CRUD
        .route(
            "/api/social-links",
            get(social_links::social_links_handler).post(social_links::create_social_link_handler),
        )
        .route(
            "/api/social-links/:id",
            put(social_links::update_social_link_handler)
                .delete(social_links::delete_social_link_handler),
        )
        .with_state(state)
}
