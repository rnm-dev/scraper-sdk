import { HttpClient } from '../client/http-client';
import { Integration } from '../types';
export declare class IntegrationsService {
    private httpClient;
    constructor(httpClient: HttpClient);
    /**
     * Get all integrations
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Get integration by website origin
     */
    getIntegrationByOrigin(websiteOrigin: string): Promise<Integration>;
}
