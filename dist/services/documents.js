"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const axios_1 = __importDefault(require("axios"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
class DocumentsService {
    constructor(config) {
        this.config = config;
        this.s3Client = new client_s3_1.S3Client({
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
    async uploadDocument({ downloadUrl, tenderNumber, websiteOrigin }) {
        try {
            // Download the file
            const response = await axios_1.default.get(downloadUrl, { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data);
            // Generate a unique filename
            const fileExtension = this.getFileExtension(downloadUrl);
            const timestamp = Date.now();
            const hash = crypto.createHash('md5').update(fileBuffer).digest('hex').substring(0, 8);
            const fileName = `${websiteOrigin}/${tenderNumber}/${timestamp}-${hash}${fileExtension}`;
            // Upload to S3
            const uploadCommand = new client_s3_1.PutObjectCommand({
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
        }
        catch (error) {
            console.error('❌ Failed to upload document to S3:', error);
            throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getFileExtension(url) {
        const pathname = new URL(url).pathname;
        return path.extname(pathname) || '.pdf';
    }
    getContentType(extension) {
        const contentTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.zip': 'application/zip',
            '.rar': 'application/x-rar-compressed',
        };
        return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
    }
    generatePublicUrl(fileName) {
        const baseUrl = this.config.endpoint;
        if (baseUrl) {
            return `${baseUrl}/${this.bucket}/${fileName}`;
        }
        else {
            // Default AWS S3
            return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
        }
    }
}
exports.DocumentsService = DocumentsService;
