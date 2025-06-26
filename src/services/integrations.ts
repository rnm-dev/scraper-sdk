import { HttpClient } from '../client/http-client';
import { Integration } from '../types';

export class IntegrationsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all integrations
   */
  async getIntegrations(): Promise<Integration[]> {
    return this.httpClient.get<Integration[]>('/api/integrations');
  }

  /**
   * Get integration by website origin
   */
  async getIntegrationByOrigin(websiteOrigin: string): Promise<Integration> {
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