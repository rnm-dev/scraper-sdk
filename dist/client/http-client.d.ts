import { AxiosRequestConfig } from 'axios';
import { ScraperSdkConfig } from '../types';
export declare class HttpClient {
    private axiosInstance;
    config: ScraperSdkConfig;
    constructor(config: ScraperSdkConfig);
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    setApiKey(apiKey: string): void;
    setBaseUrl(baseUrl: string): void;
}
