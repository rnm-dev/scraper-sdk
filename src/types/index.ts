// Base response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

// Configuration types
export interface ScraperSdkConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

// Integration types
export interface Integration {
  id: number;
  website_origin: string;
  access_token: string | null;
  refresh_token: string | null;
  authorization_token: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  website_name: string | null;
}

// Scraper Job types
export type ScraperJobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ScraperJob {
  id: number;
  integration_id: number;
  status: ScraperJobStatus;
  started_at: string | null;
  finished_at: string | null;
  duration: number | null;
  new_records: number;
  updated_records: number;
  archived_records: number;
  created_at: string;
  updated_at: string;
  integration: {
    id: number;
    website_origin: string;
    website_name: string;
  };
}

export interface CreateScraperJobRequest {
  website_origin: string;
  status?: ScraperJobStatus;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  new_records?: number;
  updated_records?: number;
  archived_records?: number;
}

export interface UpdateScraperJobRequest {
  status?: ScraperJobStatus;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  new_records?: number;
  updated_records?: number;
  archived_records?: number;
}

export interface ScraperJobFilters {
  website_origin?: string;
  status?: ScraperJobStatus;
}

// Scraping stats interface for closure return
export interface ScrapingStats {
  new_records?: number;
  updated_records?: number;
  archived_records?: number;
}

// Scraping result with job information
export interface ScrapingResult {
  jobId: number;
  job: ScraperJob;
  stats: ScrapingStats;
  duration: number; // in seconds
}

// Tender types
export interface Document {
  name: string;
  type: string;
  url: string;
}

export interface TenderItem {
  documents?: string;
  number: string;
  name: string;
  sum?: string;
  submission_end?: string;
  bidding_begin?: string;
  customer?: string;
  broker?: string;
  status?: string;
  participants?: string;
  best_sum?: string;
  document_urls?: string[];
  lots?: any[];
}

export interface SubmitTendersRequest {
  data: TenderItem[];
  websiteOrigin: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  response?: any;
}

export class ScraperSdkError extends Error {
  public status: number;
  public response?: any;

  constructor(message: string, status: number = 500, response?: any) {
    super(message);
    this.name = 'ScraperSdkError';
    this.status = status;
    this.response = response;
  }
} 