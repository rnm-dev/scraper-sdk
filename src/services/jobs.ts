import { HttpClient } from '../client/http-client';
import {
  ScraperJob,
  CreateScraperJobRequest,
  UpdateScraperJobRequest,
  ScraperJobFilters,
  ApiResponse
} from '../types';

export class JobsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create a new scraper job
   */
  async createJob(request: CreateScraperJobRequest): Promise<ScraperJob> {
    return this.httpClient.post<ScraperJob>('/api/scraper_api/jobs', request);
  }

  /**
   * Get all scraper jobs with optional filters
   */
  async getJobs(filters?: ScraperJobFilters): Promise<ScraperJob[]> {
    const params = new URLSearchParams();
    
    if (filters?.website_origin) {
      params.append('website_origin', filters.website_origin);
    }
    
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const url = params.toString() ? `/api/scraper_api/jobs?${params}` : '/api/scraper_api/jobs';
    return this.httpClient.get<ScraperJob[]>(url);
  }

  /**
   * Get a specific scraper job by ID
   */
  async getJob(jobId: number): Promise<ScraperJob> {
    return this.httpClient.get<ScraperJob>(`/api/scraper_api/jobs/${jobId}`);
  }

  /**
   * Update a scraper job
   */
  async updateJob(jobId: number, updates: UpdateScraperJobRequest): Promise<ScraperJob> {
    return this.httpClient.patch<ScraperJob>(`/api/scraper_api/jobs/${jobId}`, updates);
  }

  /**
   * Delete a scraper job
   */
  async deleteJob(jobId: number): Promise<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(`/api/scraper_api/jobs/${jobId}`);
  }

  /**
   * Start a scraper job (convenience method)
   */
  async startJob(jobId: number): Promise<ScraperJob> {
    return this.updateJob(jobId, {
      status: 'running',
      started_at: new Date().toISOString()
    });
  }

  /**
   * Complete a scraper job (convenience method)
   */
  async completeJob(
    jobId: number,
    metrics: {
      new_records?: number;
      updated_records?: number;
      archived_records?: number;
      started_at?: string;
      finished_at?: string;
      duration?: number;
    }
  ): Promise<ScraperJob> {
    return this.updateJob(jobId, {
      status: 'completed',
      finished_at: metrics.finished_at || new Date().toISOString(),
      ...metrics
    });
  }

  /**
   * Mark a scraper job as failed (convenience method)
   */
  async failJob(jobId: number): Promise<ScraperJob> {
    return this.updateJob(jobId, {
      status: 'failed',
      finished_at: new Date().toISOString()
    });
  }

  /**
   * Cancel a scraper job (convenience method)
   */
  async cancelJob(jobId: number): Promise<ScraperJob> {
    return this.updateJob(jobId, {
      status: 'cancelled',
      finished_at: new Date().toISOString()
    });
  }
} 