import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { ScraperSdkConfig, ScraperSdkError } from '../types';

export class HttpClient {
  private axiosInstance: AxiosInstance;
  public config: ScraperSdkConfig;

  constructor(config: ScraperSdkConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
      },
    });

    // Setup retry mechanism
    axiosRetry(this.axiosInstance, {
      retries: config.retries || 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status ?? 0) >= 500;
      },
    });

    // Setup request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }
        return config;
      },
      (error) => {
        if (this.config.debug) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Setup response interceptor for logging and error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.config.debug) {
          console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        if (this.config.debug) {
          console.error(`❌ ${error.response?.status || 'Network'} Error:`, {
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
          });
        }
        
        const message = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       'Unknown error occurred';
        
        throw new ScraperSdkError(
          message,
          error.response?.status || 500,
          error.response?.data
        );
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  // Method to update API key if needed
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.axiosInstance.defaults.headers['X-API-Key'] = apiKey;
  }

  // Method to update base URL if needed
  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
    this.axiosInstance.defaults.baseURL = baseUrl;
  }
} 