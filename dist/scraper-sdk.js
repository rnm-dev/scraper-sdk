"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperSdk = void 0;
const http_client_1 = require("./client/http-client");
const jobs_1 = require("./services/jobs");
const tenders_1 = require("./services/tenders");
const integrations_1 = require("./services/integrations");
class ScraperSdk {
    constructor(config) {
        this.httpClient = new http_client_1.HttpClient(config);
        // Initialize services
        this.jobs = new jobs_1.JobsService(this.httpClient);
        this.tenders = new tenders_1.TendersService(this.httpClient);
        this.integrations = new integrations_1.IntegrationsService(this.httpClient);
    }
    /**
     * Update the API key for all subsequent requests
     */
    setApiKey(apiKey) {
        this.httpClient.setApiKey(apiKey);
    }
    /**
     * Update the base URL for all subsequent requests
     */
    setBaseUrl(baseUrl) {
        this.httpClient.setBaseUrl(baseUrl);
    }
    /**
     * Get the raw HTTP client for custom requests
     */
    getHttpClient() {
        return this.httpClient;
    }
    /**
     * Health check method to verify SDK connectivity
     */
    async healthCheck() {
        try {
            await this.jobs.getJobs();
            return true;
        }
        catch (error) {
            console.error('SDK Health Check Failed:', error);
            return false;
        }
    }
    /**
     * Execute scraping with automatic job lifecycle management
     *
     * @param websiteOrigin - The website origin to scrape
     * @param scraperClosure - Async function that performs scraping and returns stats, receives integration data and scraper API
     * @returns Promise<ScrapingResult> - Complete result with job info and stats
     */
    async startScraping(websiteOrigin, scraperClosure) {
        const startTime = new Date();
        let jobId = null;
        try {
            // 1. Fetch integration data first
            const integration = await this.integrations.getIntegrationByOrigin(websiteOrigin);
            if (this.httpClient.config?.debug) {
                console.log(`🔗 Found integration for ${websiteOrigin}:`, {
                    id: integration.id,
                    website_name: integration.website_name,
                    is_active: integration.is_active
                });
            }
            // 2. Create and start the job
            const job = await this.jobs.createJob({ website_origin: websiteOrigin });
            jobId = job.id;
            const startedJob = await this.jobs.startJob(jobId);
            if (this.httpClient.config?.debug) {
                console.log(`🚀 Started scraping job ${jobId} for ${websiteOrigin}`);
            }
            // 3. Execute the scraper closure with integration data and API access
            const stats = await scraperClosure(integration, this);
            // 4. Calculate duration
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
            // 5. Complete the job with stats
            const completedJob = await this.jobs.completeJob(jobId, {
                ...stats,
                started_at: startTime.toISOString(),
                finished_at: endTime.toISOString(),
                duration
            });
            if (this.httpClient.config?.debug) {
                console.log(`✅ Completed scraping job ${jobId} in ${duration}s`, stats);
            }
            return {
                jobId,
                job: completedJob,
                stats,
                duration
            };
        }
        catch (error) {
            // Mark job as failed if it was created
            if (jobId) {
                try {
                    await this.jobs.failJob(jobId);
                    if (this.httpClient.config?.debug) {
                        console.error(`❌ Marked job ${jobId} as failed`);
                    }
                }
                catch (failError) {
                    console.error('Failed to mark job as failed:', failError);
                }
            }
            // Log the error based on the type
            if (error instanceof Error && error.message.includes('Integration not found')) {
                console.error(`❌ Integration error for ${websiteOrigin}: ${error.message}`);
            }
            else if (error instanceof Error && error.message.includes('Integration is not active')) {
                console.error(`❌ Integration inactive for ${websiteOrigin}: ${error.message}`);
            }
            else {
                console.error(`❌ Scraping failed for ${websiteOrigin}:`, error);
            }
            throw error;
        }
    }
}
exports.ScraperSdk = ScraperSdk;
