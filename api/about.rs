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
                        ]
                    },
                    {
                        "id": 2,
                        "company_name": "Digital Systems Lab",
                        "company_logo_url": null,
                        "position": "Frontend & Systems Engineer",
                        "location": "Indonesia",
                        "start_date": "2021-06-01",
                        "end_date": "2022-12-31",
                        "is_current": false,
                        "employment_type": "Contract",
                        "work_type": "Hybrid",
                        "responsibilities": [
                            "Built reactive dashboard systems and data visualizers with TypeScript, React, and Tailwind CSS",
                            "Constructed resilient RESTful API endpoints and integrated real-time WebSocket event feeds",
                            "Optimized web vital scores to maintain consistent 100/100 Lighthouse performance metrics"
                        ],
                        "what_i_learned": [
                            "Design token modularity, state machines, and micro-frontend bundling optimizations"
                        ]
                    },
                    {
                        "id": 3,
                        "company_name": "Creative Web Studio",
                        "company_logo_url": null,
                        "position": "Junior Web Developer",
                        "location": "Indonesia",
                        "start_date": "2020-03-01",
                        "end_date": "2021-05-31",
                        "is_current": false,
                        "employment_type": "Full-time",
                        "work_type": "On-site",
                        "responsibilities": [
                            "Developed client-facing web applications using modern JavaScript and accessible semantic HTML5/CSS3",
                            "Collaborated closely with UX/UI designers to transform Figma wireframes into responsive code"
                        ],
                        "what_i_learned": [
                            "Cross-browser compatibility testing, git workflow standards, and responsive layout foundations"
                        ]
                    }
                ],
                "educations": [
                    {
                        "id": 1,
                        "institution_name": "University / Institute of Technology",
                        "institution_logo_url": null,
                        "degree": "Bachelor of Computer Science",
                        "field_of_study": "Informatics & Software Engineering",
                        "start_date": "2019-09-01",
                        "end_date": "2023-07-01",
                        "is_current": false,
                        "grade": "GPA: 3.85 / 4.00",
                        "activities": "Software Engineering Club Lead, Open-Source Contributor, Algorithms Study Group",
                        "description": "Graduated with honors focusing on distributed systems architecture, compiler theory, and modern web application development."
                    },
                    {
                        "id": 2,
                        "institution_name": "Vocational Technical Academy",
                        "institution_logo_url": null,
                        "degree": "Vocational Diploma",
                        "field_of_study": "Computer Network Engineering & Systems",
                        "start_date": "2016-07-01",
                        "end_date": "2019-05-01",
                        "is_current": false,
                        "grade": "Rank 1 Honors",
                        "activities": "Network Infrastructure Lab Lead, Cisco Packet Tracer Competition",
                        "description": "Foundational training in networking protocols (TCP/IP, UDP, DNS), Linux systems administration, and server maintenance."
                    }
                ]
            })
            .to_string(),
        ))?)
}
