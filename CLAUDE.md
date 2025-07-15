# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
```bash
# Install dependencies
npm install

# Build the SDK (compiles TypeScript to JavaScript in dist/)
npm run build

# Development mode with file watching
npm run dev

# Run linter (ESLint)
npm run lint

# Run tests (Jest - no tests implemented yet)
npm test
```

### Common Development Tasks
- To add a new service: Create it in `src/services/` following the pattern of existing services (jobs.ts, tenders.ts, etc.)
- To modify API endpoints: Update the relevant service file and ensure the types in `src/types/index.ts` are updated
- To test changes: Build the SDK and use it in a test project or create example scripts

## Architecture Overview

This is a TypeScript SDK for the TenderScraper backend API. The architecture follows a service-oriented pattern:

### Core Components

1. **ScraperSdk** (src/scraper-sdk.ts): Main entry point that orchestrates the scraping lifecycle
   - Automatically manages job creation, execution, and completion
   - Validates integrations before starting scraping
   - Provides a closure-based API for scraper implementations

2. **HttpClient** (src/client/http-client.ts): Axios wrapper with retry logic
   - Handles authentication via API key
   - Implements exponential backoff for failed requests
   - Provides debug logging when enabled

3. **Services** (src/services/): API endpoint wrappers
   - **JobsService**: Manages scraper job lifecycle (create, start, complete, fail)
   - **TendersService**: Handles tender data submission with automatic chunking
   - **IntegrationsService**: Fetches integration configurations and API tokens
   - **DocumentsService**: Manages S3 document uploads with presigned URLs (supports both URL downloads and local file uploads)

### Key Patterns

1. **Closure-Based Scraping**: The SDK uses a closure pattern where the scraping logic is passed as a function that receives:
   - `integration`: Contains API tokens and configuration for the target website
   - `api`: Object with all service methods (tenders, documents, etc.)

2. **Automatic Job Management**: The SDK handles the entire job lifecycle internally:
   ```
   Create Job → Validate Integration → Start Job → Execute Scraper → Complete/Fail Job
   ```

3. **Error Handling**: All services use try-catch with proper error propagation. Network errors trigger automatic retries.

4. **Chunking**: The TendersService automatically chunks large arrays to respect API limits (100 items per request).

### Important Implementation Details

- **Authentication**: API key is passed in the `x-api-key` header
- **Base URL**: Must be provided when initializing the SDK
- **S3 Configuration**: Optional, only needed if using document uploads
- **Debug Mode**: Set `debug: true` to enable detailed logging
- **Timeout**: Default 30 seconds, configurable per SDK instance

### Recent Changes

The codebase has undergone recent refactoring:
- Tender submission simplified to single `create` method (replaced `submit` and `submitBatch`)
- Added S3 document upload functionality with support for both URL downloads and local file uploads
- Updated integration endpoints to use new API structure
- Enhanced authentication support for scrapers
- DocumentsService now accepts either `downloadUrl` or `filePath` for flexible document uploads

### Testing Approach

Jest is configured but no tests exist yet. When implementing tests:
- Mock the HttpClient for unit tests
- Use integration tests for the full scraping lifecycle
- Test error scenarios and retry logic
- Verify chunking behavior with large datasets