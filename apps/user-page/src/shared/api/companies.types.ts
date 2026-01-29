export type Company = {
  id: string;
  name: string;
  slug: string;
  legal_name?: string | null;
  country?: string | null;
  timezone?: string | null;
  default_locale?: string | null;
  logo_url?: string | null;
  branding_primary_color?: string | null;
  branding_secondary_color?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CompaniesResponse = {
  items: Company[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};
