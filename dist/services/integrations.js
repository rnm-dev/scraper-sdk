"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
class IntegrationsService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Get all integrations
     */
    async getIntegrations() {
        return this.httpClient.get('/api/integrations');
    }
    /**
     * Get integration by website origin
     */
    async getIntegrationByOrigin(websiteOrigin) {
        const integrations = await this.getIntegrations();
        const integration = integrations.find(i => i.website_origin === websiteOrigin);
        if (!integration) {
            throw new Error(`Integration not found for website origin: ${websiteOrigin}`);
        }
        if (!integration.is_active) {
            throw new Error(`Integration is not active for website origin: ${websiteOrigin}`);
        }
        return integration;
    }
}
exports.IntegrationsService = IntegrationsService;
