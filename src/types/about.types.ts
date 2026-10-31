export interface Experience {
  id: number | string;
  company_name: string;
  company_logo_url: string | null;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  employment_type: string;
  work_type: string;
  responsibilities: string[];
  what_i_learned: string[];
  impact?: string[];
}

export interface Education {
  id: number | string;
  institution_name: string;
  institution_logo_url: string | null;
  degree: string;
  field_of_study: string;
  location?: string;
  grade?: string | null;
  gpa?: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  activities?: string;
}

export interface AboutData {
  experiences: Experience[];
  educations: Education[];
}
