export interface SocialLink {
  id: number | string;
  platform: string;
  title: string;
  description: string | null;
  url: string;
  is_featured: boolean;
  username?: string | null;
}
