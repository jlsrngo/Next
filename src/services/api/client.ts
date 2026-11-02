export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const isMutation = method !== 'GET' && method !== 'HEAD';

  // 1. In local development, attempt direct connection to Rust Axum server
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
      if (isMutation) {
        let errMsg = `Axum error: ${axumRes.status} ${axumRes.statusText}`;
        try {
          const errData = await axumRes.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new ApiError(axumRes.status, errMsg);
      }
    } catch (err) {
      if (isMutation) throw err;
      // Continue to next layer for GET if Axum daemon is not active
    }
  }

  // 2. Standard relative or configured endpoint (Vercel serverless / proxy)
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;

  try {
    const res = await fetch(url, {
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
      if (isMutation) {
        throw new ApiError(502, 'API endpoint returned non-JSON response');
      }
    } else {
      if (isMutation) {
        let errMsg = `Request failed (${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new ApiError(res.status, errMsg);
      }
    }
  } catch (err) {
    if (isMutation) throw err;
  }

  // 3. Graceful fallback to verified Neon PostgreSQL snapshot (READ-ONLY)
  if (isMutation) {
    throw new ApiError(503, 'Backend mutation unavailable in offline mode');
  }

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
