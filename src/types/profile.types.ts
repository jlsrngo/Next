export interface Profile {
  id?: number | string;
  name: string;
  fullName?: string;
  username?: string | null;
  headline?: string | null;
  bio_home?: string | null;
  bio_about?: string | null;
  location?: string | null;
  work_status?: string | null;
  avatar_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  email?: string | null;
  website?: string | null;
  accent_color?: string | null;
}
