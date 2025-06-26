import { HttpClient } from './client/http-client';
import { JobsService } from './services/jobs';
import { TendersService } from './services/tenders';
import { IntegrationsService } from './services/integrations';
import { DocumentsService } from './services/documents';
import { ScraperSdkConfig, ScrapingStats, ScrapingResult, Integration } from './types';
export interface ScraperAPI {
    readonly jobs: JobsService;
    readonly tenders: TendersService;
    readonly integrations: IntegrationsService;
    readonly documents: DocumentsService;
}
export declare class ScraperSdk implements ScraperAPI {
    private httpClient;
    readonly jobs: JobsService;
    readonly tenders: TendersService;
    readonly integrations: IntegrationsService;
    readonly documents: DocumentsService;
    constructor(config: ScraperSdkConfig);
    /**
     * Update the API key for all subsequent requests
     */
    setApiKey(apiKey: string): void;
    /**
     * Update the base URL for all subsequent requests
     */
    setBaseUrl(baseUrl: string): void;
    /**
     * Get the raw HTTP client for custom requests
     */
    getHttpClient(): HttpClient;
    /**
     * Health check method to verify SDK connectivity
     */
    healthCheck(): Promise<boolean>;
    /**
     * Execute scraping with automatic job lifecycle management
     *
     * @param websiteOrigin - The website origin to scrape
     * @param scraperClosure - Async function that performs scraping and returns stats, receives integration data and scraper API
     * @returns Promise<ScrapingResult> - Complete result with job info and stats
     */
    startScraping(websiteOrigin: string, scraperClosure: (integration: Integration, api: ScraperAPI) => Promise<ScrapingStats>): Promise<ScrapingResult>;
}
