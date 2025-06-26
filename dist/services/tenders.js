"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TendersService = void 0;
class TendersService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Submit tenders in batch to the backend
     */
    async submitTenders(tenders, websiteOrigin) {
        const request = {
            data: tenders,
            websiteOrigin
        };
        return this.httpClient.post('/api/scrapers/tenders/by_batch', request);
    }
    /**
     * Submit a single tender (convenience method)
     */
    async submitTender(tender, websiteOrigin) {
        return this.submitTenders([tender], websiteOrigin);
    }
    /**
     * Submit archived tenders
     */
    async submitArchivedTenders(tenders, websiteOrigin) {
        const request = {
            data: tenders,
            websiteOrigin
        };
        return this.httpClient.post('/api/scrapers/tenders/archived', request);
    }
    /**
     * Batch tender submission with chunking for large datasets
     */
    async submitTendersInChunks(tenders, websiteOrigin, chunkSize = 100) {
        const chunks = this.chunkArray(tenders, chunkSize);
        const results = [];
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
            }
            catch (error) {
                console.error(`❌ Failed to submit chunk ${i + 1}:`, error);
                throw error;
            }
        }
        return results;
    }
    /**
     * Helper method to chunk an array
     */
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
    /**
     * Helper method for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.TendersService = TendersService;
