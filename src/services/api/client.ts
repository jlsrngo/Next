export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : endpoint;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    // Attempt local database snapshot fallback if connection drops
  }

  // Graceful fallback to verified database snapshot
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
          profile: db.profile,
          experiences: db.experiences,
          educations: db.educations,
        } as T;
      }
      if (endpoint.includes('dashboard')) return db.stats as T;
    }
  } catch {}

  throw new ApiError(500, `Request to ${endpoint} failed`);
}
