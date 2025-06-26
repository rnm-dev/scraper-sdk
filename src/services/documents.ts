import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as path from 'path';
import * as crypto from 'crypto';
import { S3Config } from '../types';

export interface DocumentUploadOptions {
  downloadUrl: string;
  tenderNumber: string;
  websiteOrigin: string;
}

export interface DocumentUploadResult {
  url: string;
}

export class DocumentsService {
  private s3Client: S3Client;
  private bucket: string;
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
  }

  /**
   * Upload documents from a download URL to S3 storage
   * This method handles:
   * - Downloading the file from the URL
   * - Uploading directly to S3
   * - Returning the public URLs
   */
  async uploadDocument({
    downloadUrl,
    tenderNumber,
    websiteOrigin
  }: DocumentUploadOptions): Promise<DocumentUploadResult> {
    try {
      // Download the file
      const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(response.data);
      
      // Generate a unique filename
      const fileExtension = this.getFileExtension(downloadUrl);
      const timestamp = Date.now();
      const hash = crypto.createHash('md5').update(fileBuffer).digest('hex').substring(0, 8);
      const fileName = `${websiteOrigin}/${tenderNumber}/${timestamp}-${hash}${fileExtension}`;
      
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: this.getContentType(fileExtension),
      });
      
      await this.s3Client.send(uploadCommand);
      
      // Generate public URL - handle custom endpoints
      const publicUrl = this.generatePublicUrl(fileName);
      
      return {
        url: publicUrl
      };
    } catch (error) {
      console.error('❌ Failed to upload document to S3:', error);
      throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getFileExtension(url: string): string {
    const pathname = new URL(url).pathname;
    return path.extname(pathname) || '.pdf';
  }

  private getContentType(extension: string): string {
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
    };
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  private generatePublicUrl(fileName: string): string {
    const baseUrl = this.config.endpoint;
    if (baseUrl) {
      return `${baseUrl}/${this.bucket}/${fileName}`;
    } else {
      // Default AWS S3
      return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
    }
  }
} 