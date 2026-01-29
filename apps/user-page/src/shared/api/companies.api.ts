import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CompaniesResponse, Company } from './companies.types';

const COMPANIES_API_BASE_URL = 'http://99.110.149.130/api';
const DEFAULT_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class CompaniesApi {
  private readonly http = inject(HttpClient);

  listCompanies(page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<CompaniesResponse> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return firstValueFrom(
      this.http.get<CompaniesResponse>(`${COMPANIES_API_BASE_URL}/companies`, { params }),
    );
  }

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
}
