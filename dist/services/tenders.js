"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TendersService = void 0;
class TendersService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Create tenders in the system
     * @param tenders - Array of tender items to create/update
     * @param websiteOrigin - The website origin (e.g., 'ets.kz')
     * @param chunkSize - Optional chunk size for large datasets (default: 100)
     * @returns Statistics about created/updated tenders
     */
    async create(tenders, websiteOrigin, chunkSize = 100) {
        // Handle small datasets directly
        if (tenders.length <= chunkSize) {
            const request = {
                data: tenders,
                websiteOrigin
            };
            const result = await this.httpClient.post('/api/scraper_api/tenders/batch', request);
            return result.stats;
        }
        // Handle large datasets with chunking
        const chunks = this.chunkArray(tenders, chunkSize);
        const totalStats = { new: 0, updated: 0 };
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`📦 Processing chunk ${i + 1}/${chunks.length} (${chunk.length} tenders)`);
            try {
                const request = {
                    data: chunk,
                    websiteOrigin
                };
                const result = await this.httpClient.post('/api/scraper_api/tenders/batch', request);
                // Accumulate statistics
                totalStats.new += result.stats.new;
                totalStats.updated += result.stats.updated;
                console.log(`✅ Chunk ${i + 1} completed: ${result.stats.new} new, ${result.stats.updated} updated`);
            }
            catch (error) {
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
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
}
exports.TendersService = TendersService;
