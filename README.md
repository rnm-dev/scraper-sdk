# 🚀 Scraper SDK

A TypeScript SDK for interacting with the TenderScraper backend API. This SDK provides a unified interface for all scraper operations with **automatic job lifecycle management** and **integration validation**.


## 🚀 Quick Start

The SDK uses a **closure-based approach** that automatically handles the entire scraper job lifecycle:

```typescript
import { ScraperSdk } from '@tenderscraper/sdk';

// Initialize the SDK
const sdk = new ScraperSdk({
  baseUrl: 'https://your-api.com',
  apiKey: 'your-api-key',
  debug: true,
  s3: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
    region: 'us-east-1',
    bucket: 'your-bucket',
    endpoint: 'https://minio.example.com' // Optional for custom S3 endpoints
  }
});

// Run your scraper with automatic job management
const result = await sdk.startScraping('ets.kz', async (integration, api) => {
  // 1. Integration data is automatically fetched and passed to your closure
  console.log('Integration ID:', integration.id);
  console.log('Website Name:', integration.website_name);
  
  // 2. Use integration access_token for authenticated API calls
  const headers = {
    'Authorization': `Bearer ${integration.access_token}`,
    'X-API-Key': integration.authorization_token
  };
  
  // 3. Your scraping logic with proper authentication
  const scrapedTenders = await scrapeWebsiteWithAuth('https://api.ets.kz/tenders', headers);
  
  // 4. Submit the data using the clean API interface
  await api.tenders.create(scrapedTenders, 'ets.kz');
  
  // 5. Upload documents for each tender (if available)
  for (const tender of scrapedTenders) {
    if (tender.documentUrl) {
      try {
        const documentResult = await api.documents.uploadDocument({
          downloadUrl: tender.documentUrl,
          tenderNumber: tender.number,
          websiteOrigin: 'ets.kz'
        });
        console.log(`📄 Document uploaded for tender ${tender.number}: ${documentResult.url}`);
      } catch (error) {
        console.warn(`⚠️ Failed to upload document for tender ${tender.number}:`, error);
      }
    }
  }
  
  // 6. Return stats - SDK handles everything else!
  return {
    new_records: scrapedTenders.length,
    updated_records: 0,
    archived_records: 0
  };
});
```

## 🔥 What the SDK Does Automatically

When you call `startScraping()`:

1. ✅ **Validates** integration exists and is active for the website
2. ✅ **Fetches** integration data (tokens, configuration, etc.)
3. ✅ **Creates** a scraper job in the backend
4. ✅ **Starts** the job and records start time
5. ✅ **Executes** your scraper closure with integration data
6. ✅ **Tracks** execution duration automatically  
7. ✅ **Completes** the job with your returned stats
8. ✅ **Handles errors** and marks job as failed if something goes wrong

## 🔗 Integration Management

The SDK now includes automatic integration validation and data fetching:

```typescript
// Integration data is automatically passed to your scraper closure
const result = await sdk.startScraping('zakup.sk.kz', async (integration, api) => {
  // Use integration data for authentication, configuration, etc.
  const headers = {
    'Authorization': `Bearer ${integration.access_token}`,
    'X-API-Key': integration.authorization_token
  };
  
  // Your scraping logic with proper authentication
  const data = await fetch('https://api.example.com/data', { headers });
  
  // Access all services through the clean API interface
  await api.tenders.create(data, 'zakup.sk.kz');
  
  return { new_records: data.length };
});

// Manual integration management (if needed)
const integration = await sdk.integrations.getIntegrationByOrigin('ets.kz');
const allIntegrations = await sdk.integrations.getIntegrations();
```

### Integration Error Handling

The SDK provides specific error handling for integration issues:

- **❌ Integration not found**: Throws error if no integration exists for the website
- **❌ Integration inactive**: Throws error if integration is disabled
- **✅ Integration valid**: Proceeds with scraping and passes data to closure

## 📚 API Reference

### Configuration

```typescript
interface ScraperSdkConfig {
  baseUrl: string;        // Backend API base URL
  apiKey: string;         // API authentication key
  timeout?: number;       // Request timeout (default: 30000ms)
  retries?: number;       // Number of retries (default: 3)
  debug?: boolean;        // Enable debug logging (default: false)
  s3?: S3Config;          // S3 configuration for document uploads
}

interface S3Config {
  accessKeyId: string;    // AWS access key ID
  secretAccessKey: string; // AWS secret access key
  region: string;         // AWS region (e.g., 'us-east-1')
  bucket: string;         // S3 bucket name
  endpoint?: string;      // Custom S3 endpoint (for MinIO, DigitalOcean, etc.)
}
```

### ScraperAPI Interface

The SDK provides a clean, focused interface for your scraper closures:

```typescript
interface ScraperAPI {
  readonly jobs: JobsService;
  readonly tenders: TendersService;
  readonly integrations: IntegrationsService;
  readonly documents: DocumentsService;
}
```

This interface is passed as the second parameter to your scraper closure, giving you access to all the services you need without exposing internal SDK methods.

### Integration Interface

```typescript
interface Integration {
  id: number;
  website_origin: string;
  access_token: string | null;
  refresh_token: string | null;
  authorization_token: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  website_name: string | null;
}
```

### Main Scraping API

```typescript
// Closure-based scraper execution (RECOMMENDED)
const result = await sdk.startScraping('website.com', async (integration, api) => {
  // Integration data is automatically fetched and validated
  console.log('Integration:', integration.website_name);
  
  // Your scraping logic here
  const data = await performScraping(integration);
  
  // Use the clean API interface for all operations
  await api.tenders.create(data, 'website.com');
  
  // You can also upload documents to S3 and access other services
  const documentResult = await api.documents.uploadDocument({
    downloadUrl: 'https://example.com/tender-docs.zip',
    tenderNumber: data[0].number,
    websiteOrigin: 'website.com'
  });
  console.log('Document uploaded:', documentResult.url);
  
  const jobs = await api.jobs.getJobs();
  const integrations = await api.integrations.getIntegrations();
  
  // Return stats
  return {
    new_records: data.length,
    updated_records: 0,
    archived_records: 0
  };
});

// result.jobId - The job ID
// result.duration - Duration in seconds  
// result.stats - Your returned stats
// result.job - Complete job object
```

### Integrations API

```typescript
// Get all integrations
const integrations = await sdk.integrations.getIntegrations();

// Get specific integration by website origin
const integration = await sdk.integrations.getIntegrationByOrigin('ets.kz');

// Integration validation is automatic in startScraping()
```

### Tenders API

```typescript
// Submit single tender
await sdk.tenders.create([{
  number: 'T-12345',
  name: 'Example Tender',
  sum: '1000000'
}], 'ets.kz');

// Submit multiple tenders
await sdk.tenders.create(tenderArray, 'ets.kz');
```

### Documents API

```typescript
// Upload documents directly to S3
const result = await sdk.documents.uploadDocument({
  downloadUrl: 'https://example.com/tender-documents.zip',
  tenderNumber: 'T-12345',
  websiteOrigin: 'ets.kz'
});

console.log('Document URL:', result.url);
// File will be stored as: websiteOrigin/tenderNumber/timestamp-hash.extension
// Example: ets.kz/T-12345/1640995200000-a1b2c3d4.zip
```

### Jobs API (Manual Control)

```typescript
// Manual job control (if you need fine-grained control)
const job = await sdk.jobs.createJob({ website_origin: 'ets.kz' });
await sdk.jobs.startJob(job.id);
await sdk.jobs.completeJob(job.id, { new_records: 10 });

// Get jobs with filters
const jobs = await sdk.jobs.getJobs({
  website_origin: 'ets.kz',
  status: 'completed'
});
```

## 🚨 Error Handling

```typescript
try {
  const result = await sdk.startScraping('invalid-website.com', async (integration, api) => {
    return { new_records: 0 };
  });
} catch (error) {
  if (error.message.includes('Integration not found')) {
    console.error('❌ No integration configured for this website');
  } else if (error.message.includes('Integration is not active')) {
    console.error('❌ Integration is disabled');
  } else {
    console.error('❌ Scraping failed:', error);
  }
}
```

### Environment Configuration

```typescript
const sdk = new ScraperSdk({
  baseUrl: process.env.API_URL || 'http://localhost:5173',
  apiKey: process.env.API_KEY || '',
  debug: process.env.NODE_ENV === 'development',
  timeout: process.env.NODE_ENV === 'production' ? 60000 : 10000
});
```


## 🛠️ Development

```bash
# Install dependencies
npm install

# Install AWS SDK (required for document uploads)
npm install @aws-sdk/client-s3

# Build the SDK
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 📊 Health Check

```typescript
// Verify SDK connectivity (tests jobs API)
const isHealthy = await sdk.healthCheck();
console.log('SDK Health:', isHealthy ? '✅ OK' : '❌ Failed');
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. 