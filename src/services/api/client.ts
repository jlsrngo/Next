export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // 1. In local development, attempt direct sub-millisecond connection to Rust Axum server
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal && endpoint.startsWith('/api')) {
    try {
      const axumRes = await fetch(`http://127.0.0.1:8080${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (axumRes.ok) {
        return (await axumRes.json()) as T;
      }
    } catch {
      // Continue to next layer if Axum daemon is not active
    }
  }

  // 2. Standard relative endpoint (proxied or serverless)
  try {
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return (await res.json()) as T;
      }
    }
  } catch {
    // Continue to verified database snapshot fallback
  }

  // 3. Graceful fallback to verified Neon PostgreSQL snapshot
  try {
    const fallbackRes = await fetch('/db-data.json');
    if (fallbackRes.ok) {
      const db = await fallbackRes.json();
      if (endpoint.includes('profile')) return db.profile as T;
      if (endpoint.includes('skills')) return db.skills as T;
      if (endpoint.includes('projects')) return db.projects as T;
      if (endpoint.includes('experiences')) return db.experiences as T;
      if (endpoint.includes('educations')) return db.educations as T;
      if (endpoint.includes('achievements')) return db.achievements as T;
      if (endpoint.includes('social-links') || endpoint.includes('contact')) return (db.socialLinks || []) as T;
      if (endpoint.includes('about')) {
        return {
          experiences: db.experiences,
          educations: db.educations,
        } as T;
      }
      if (endpoint.includes('dashboard')) return db.stats as T;
      if (endpoint.includes('trending')) {
        return {
          status: 'SNAPSHOT',
          source: 'Tech Radar',
          headline: 'High-Performance Systems with Rust & Axum',
          metric: 'SYS // NOMINAL',
          spec: 'TECH WIRE // ACTIVE PIPELINE',
        } as T;
      }
    }
  } catch {}

  throw new ApiError(500, `Request to ${endpoint} failed`);
}
