import { S3Config } from '../types';
export interface DocumentUploadOptions {
    downloadUrl: string;
    tenderNumber: string;
    websiteOrigin: string;
}
export interface DocumentUploadResult {
    url: string;
}
export declare class DocumentsService {
    private s3Client;
    private bucket;
    private config;
    constructor(config: S3Config);
    /**
     * Upload documents from a download URL to S3 storage
     * This method handles:
     * - Downloading the file from the URL
     * - Uploading directly to S3
     * - Returning the public URLs
     */
    uploadDocument({ downloadUrl, tenderNumber, websiteOrigin }: DocumentUploadOptions): Promise<DocumentUploadResult>;
    private getFileExtension;
    private getContentType;
    private generatePublicUrl;
}
