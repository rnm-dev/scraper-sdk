"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const types_1 = require("../types");
class HttpClient {
    constructor(config) {
        this.config = config;
        this.axiosInstance = axios_1.default.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.apiKey,
            },
        });
        // Setup retry mechanism
        (0, axios_retry_1.default)(this.axiosInstance, {
            retries: config.retries || 3,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                return axios_retry_1.default.isNetworkOrIdempotentRequestError(error) ||
                    (error.response?.status ?? 0) >= 500;
            },
        });
        // Setup request interceptor for logging
        this.axiosInstance.interceptors.request.use((config) => {
            if (this.config.debug) {
                console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
                    data: config.data,
                    params: config.params,
                });
            }
            return config;
        }, (error) => {
            if (this.config.debug) {
                console.error('❌ Request Error:', error);
            }
            return Promise.reject(error);
        });
        // Setup response interceptor for logging and error handling
        this.axiosInstance.interceptors.response.use((response) => {
            if (this.config.debug) {
                console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
            }
            return response;
        }, (error) => {
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
            throw new types_1.ScraperSdkError(message, error.response?.status || 500, error.response?.data);
        });
    }
    async get(url, config) {
        const response = await this.axiosInstance.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.axiosInstance.post(url, data, config);
        return response.data;
    }
    async patch(url, data, config) {
        const response = await this.axiosInstance.patch(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.axiosInstance.delete(url, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.axiosInstance.put(url, data, config);
        return response.data;
    }
    // Method to update API key if needed
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.axiosInstance.defaults.headers['X-API-Key'] = apiKey;
    }
    // Method to update base URL if needed
    setBaseUrl(baseUrl) {
        this.config.baseUrl = baseUrl;
        this.axiosInstance.defaults.baseURL = baseUrl;
    }
}
exports.HttpClient = HttpClient;
