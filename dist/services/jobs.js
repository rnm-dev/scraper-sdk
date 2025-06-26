"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
class JobsService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Create a new scraper job
     */
    async createJob(request) {
        return this.httpClient.post('/api/scraper_api/jobs', request);
    }
    /**
     * Get all scraper jobs with optional filters
     */
    async getJobs(filters) {
        const params = new URLSearchParams();
        if (filters?.website_origin) {
            params.append('website_origin', filters.website_origin);
        }
        if (filters?.status) {
            params.append('status', filters.status);
        }
        const url = params.toString() ? `/api/scraper_api/jobs?${params}` : '/api/scraper_api/jobs';
        return this.httpClient.get(url);
    }
    /**
     * Get a specific scraper job by ID
     */
    async getJob(jobId) {
        return this.httpClient.get(`/api/scraper_api/jobs/${jobId}`);
    }
    /**
     * Update a scraper job
     */
    async updateJob(jobId, updates) {
        return this.httpClient.patch(`/api/scraper_api/jobs/${jobId}`, updates);
    }
    /**
     * Delete a scraper job
     */
    async deleteJob(jobId) {
        return this.httpClient.delete(`/api/scraper_api/jobs/${jobId}`);
    }
    /**
     * Start a scraper job (convenience method)
     */
    async startJob(jobId) {
        return this.updateJob(jobId, {
            status: 'running',
            started_at: new Date().toISOString()
        });
    }
    /**
     * Complete a scraper job (convenience method)
     */
    async completeJob(jobId, metrics) {
        return this.updateJob(jobId, {
            status: 'completed',
            finished_at: metrics.finished_at || new Date().toISOString(),
            ...metrics
        });
    }
    /**
     * Mark a scraper job as failed (convenience method)
     */
    async failJob(jobId) {
        return this.updateJob(jobId, {
            status: 'failed',
            finished_at: new Date().toISOString()
        });
    }
    /**
     * Cancel a scraper job (convenience method)
     */
    async cancelJob(jobId) {
        return this.updateJob(jobId, {
            status: 'cancelled',
            finished_at: new Date().toISOString()
        });
    }
}
exports.JobsService = JobsService;
