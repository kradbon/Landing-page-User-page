import { CompaniesResponse, Company } from "@/portal/api/companies.types";

const COMPANIES_API_BASE_URL = "http://99.110.149.130/api";
const DEFAULT_PAGE_SIZE = 100;

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }
  return (await response.json()) as T;
}

export const CompaniesApi = {
  listCompanies(page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<CompaniesResponse> {
    const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    return request<CompaniesResponse>(`${COMPANIES_API_BASE_URL}/companies?${params.toString()}`);
  },

  async findCompanyBySlug(slug: string): Promise<Company | null> {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return null;
    let page = 1;
    while (true) {
      const response = await this.listCompanies(page);
      const match = response.items.find((company) => company.slug?.toLowerCase() === normalized);
      if (match) return match;
      if (!response.pages || page >= response.pages) return null;
      page += 1;
    }
  }
};

