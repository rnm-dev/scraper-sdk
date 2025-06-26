import { HttpClient } from '../client/http-client';
import { TenderItem, SubmitTendersRequest, ApiResponse } from '../types';

export class TendersService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Submit tenders in batch to the backend
   */
  async submitTenders(
    tenders: TenderItem[],
    websiteOrigin: string
  ): Promise<ApiResponse> {
    const request: SubmitTendersRequest = {
      data: tenders,
      websiteOrigin
    };

    return this.httpClient.post<ApiResponse>('/api/scrapers/tenders/by_batch', request);
  }

  /**
   * Submit a single tender (convenience method)
   */
  async submitTender(
    tender: TenderItem,
    websiteOrigin: string
  ): Promise<ApiResponse> {
    return this.submitTenders([tender], websiteOrigin);
  }

  /**
   * Submit archived tenders
   */
  async submitArchivedTenders(
    tenders: TenderItem[],
    websiteOrigin: string
  ): Promise<ApiResponse> {
    const request: SubmitTendersRequest = {
      data: tenders,
      websiteOrigin
    };

    return this.httpClient.post<ApiResponse>('/api/scrapers/tenders/archived', request);
  }

  /**
   * Batch tender submission with chunking for large datasets
   */
  async submitTendersInChunks(
    tenders: TenderItem[],
    websiteOrigin: string,
    chunkSize: number = 100
  ): Promise<ApiResponse[]> {
    const chunks = this.chunkArray(tenders, chunkSize);
    const results: ApiResponse[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📦 Submitting chunk ${i + 1}/${chunks.length} (${chunk.length} tenders)`);
      
      try {
        const result = await this.submitTenders(chunk, websiteOrigin);
        results.push(result);
        
        // Small delay between chunks to avoid overwhelming the server
        if (i < chunks.length - 1) {
          await this.delay(1000);
        }
      } catch (error) {
        console.error(`❌ Failed to submit chunk ${i + 1}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Helper method to chunk an array
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Helper method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 