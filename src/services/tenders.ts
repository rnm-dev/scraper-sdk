import { HttpClient } from '../client/http-client';
import { TenderItem, SubmitTendersRequest, BatchSubmitResponse } from '../types';

export class TendersService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create tenders in the system
   * @param tenders - Array of tender items to create/update
   * @param websiteOrigin - The website origin (e.g., 'ets.kz')
   * @param chunkSize - Optional chunk size for large datasets (default: 100)
   * @returns Statistics about created/updated tenders
   */
  async create(
    tenders: TenderItem[],
    websiteOrigin: string,
    chunkSize: number = 100
  ): Promise<{ new: number; updated: number }> {
    // Handle small datasets directly
    if (tenders.length <= chunkSize) {
      const request: SubmitTendersRequest = {
        data: tenders,
        websiteOrigin
      };
      
      const result = await this.httpClient.post<BatchSubmitResponse>('/api/scraper_api/tenders/batch', request);
      return result.stats;
    }

    // Handle large datasets with chunking
    const chunks = this.chunkArray(tenders, chunkSize);
    const totalStats = { new: 0, updated: 0 };

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📦 Processing chunk ${i + 1}/${chunks.length} (${chunk.length} tenders)`);
      
      try {
        const request: SubmitTendersRequest = {
          data: chunk,
          websiteOrigin
        };
        
        const result = await this.httpClient.post<BatchSubmitResponse>('/api/scraper_api/tenders/batch', request);
        
        // Accumulate statistics
        totalStats.new += result.stats.new;
        totalStats.updated += result.stats.updated;
        
        console.log(`✅ Chunk ${i + 1} completed: ${result.stats.new} new, ${result.stats.updated} updated`);
      } catch (error) {
        console.error(`❌ Failed to process chunk ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(`🎯 Total results: ${totalStats.new} new, ${totalStats.updated} updated tenders`);
    return totalStats;
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
} 