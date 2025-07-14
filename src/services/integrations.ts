import { HttpClient } from '../client/http-client';
import { Integration } from '../types';

export class IntegrationsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all integrations
   */
  async getIntegrations(): Promise<Integration[]> {
    return this.httpClient.get<Integration[]>('/scraper_api/integrations');
  }

  /**
   * Get integration by website origin
   */
  async getIntegrationByOrigin(websiteOrigin: string): Promise<Integration> {
    const integration = await this.httpClient.get<Integration>(`/scraper_api/integrations/${websiteOrigin}`);
    
    if (!integration) {
      throw new Error(`Integration not found for website origin: ${websiteOrigin}`);
    }

    if (!integration.is_active) {
      throw new Error(`Integration is not active for website origin: ${websiteOrigin}`);
    }

    return integration;
  }
} 
