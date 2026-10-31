export interface Project {
  id: number | string;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  tech_stack: string[] | string;
  featured: boolean;
  order_index?: number;
  order?: number;
}
