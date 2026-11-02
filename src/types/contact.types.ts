export interface SocialLink {
  id: number | string;
  platform: string;
  title: string;
  description: string | null;
  url: string;
  is_featured: boolean;
  isFeatured?: boolean;
  order?: number;
  username?: string | null;
}
