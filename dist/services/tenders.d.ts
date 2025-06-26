import { HttpClient } from '../client/http-client';
import { TenderItem } from '../types';
export declare class TendersService {
    private httpClient;
    constructor(httpClient: HttpClient);
    /**
     * Create tenders in the system
     * @param tenders - Array of tender items to create/update
     * @param websiteOrigin - The website origin (e.g., 'ets.kz')
     * @param chunkSize - Optional chunk size for large datasets (default: 100)
     * @returns Statistics about created/updated tenders
     */
    create(tenders: TenderItem[], websiteOrigin: string, chunkSize?: number): Promise<{
        new: number;
        updated: number;
    }>;
    /**
     * Helper method to chunk an array
     */
    private chunkArray;
}
