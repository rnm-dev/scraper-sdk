import { HttpClient } from '../client/http-client';
import { TenderItem, ApiResponse } from '../types';
export declare class TendersService {
    private httpClient;
    constructor(httpClient: HttpClient);
    /**
     * Submit tenders in batch to the backend
     */
    submitTenders(tenders: TenderItem[], websiteOrigin: string): Promise<ApiResponse>;
    /**
     * Submit a single tender (convenience method)
     */
    submitTender(tender: TenderItem, websiteOrigin: string): Promise<ApiResponse>;
    /**
     * Submit archived tenders
     */
    submitArchivedTenders(tenders: TenderItem[], websiteOrigin: string): Promise<ApiResponse>;
    /**
     * Batch tender submission with chunking for large datasets
     */
    submitTendersInChunks(tenders: TenderItem[], websiteOrigin: string, chunkSize?: number): Promise<ApiResponse[]>;
    /**
     * Helper method to chunk an array
     */
    private chunkArray;
    /**
     * Helper method for delays
     */
    private delay;
}
