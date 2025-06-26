import { HttpClient } from '../client/http-client';
import { ScraperJob, CreateScraperJobRequest, UpdateScraperJobRequest, ScraperJobFilters, ApiResponse } from '../types';
export declare class JobsService {
    private httpClient;
    constructor(httpClient: HttpClient);
    /**
     * Create a new scraper job
     */
    createJob(request: CreateScraperJobRequest): Promise<ScraperJob>;
    /**
     * Get all scraper jobs with optional filters
     */
    getJobs(filters?: ScraperJobFilters): Promise<ScraperJob[]>;
    /**
     * Get a specific scraper job by ID
     */
    getJob(jobId: number): Promise<ScraperJob>;
    /**
     * Update a scraper job
     */
    updateJob(jobId: number, updates: UpdateScraperJobRequest): Promise<ScraperJob>;
    /**
     * Delete a scraper job
     */
    deleteJob(jobId: number): Promise<ApiResponse>;
    /**
     * Start a scraper job (convenience method)
     */
    startJob(jobId: number): Promise<ScraperJob>;
    /**
     * Complete a scraper job (convenience method)
     */
    completeJob(jobId: number, metrics: {
        new_records?: number;
        updated_records?: number;
        archived_records?: number;
        started_at?: string;
        finished_at?: string;
        duration?: number;
    }): Promise<ScraperJob>;
    /**
     * Mark a scraper job as failed (convenience method)
     */
    failJob(jobId: number): Promise<ScraperJob>;
    /**
     * Cancel a scraper job (convenience method)
     */
    cancelJob(jobId: number): Promise<ScraperJob>;
}
