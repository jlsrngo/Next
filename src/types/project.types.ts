export interface Project {
  id: number | string;
  title: string;
  description: string;
  image_url?: string | null;
  imageUrl?: string | null;
  live_url?: string | null;
  liveUrl?: string | null;
  github_url?: string | null;
  githubUrl?: string | null;
  tech_stack?: string[] | string;
  techStack?: string[] | string;
  featured: boolean;
  order_index?: number;
  order?: number;
}
