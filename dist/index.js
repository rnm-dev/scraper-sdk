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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.HttpClient = exports.DocumentsService = exports.IntegrationsService = exports.TendersService = exports.JobsService = exports.ScraperSdk = void 0;
// Main SDK class
var scraper_sdk_1 = require("./scraper-sdk");
Object.defineProperty(exports, "ScraperSdk", { enumerable: true, get: function () { return scraper_sdk_1.ScraperSdk; } });
// Services
var jobs_1 = require("./services/jobs");
Object.defineProperty(exports, "JobsService", { enumerable: true, get: function () { return jobs_1.JobsService; } });
var tenders_1 = require("./services/tenders");
Object.defineProperty(exports, "TendersService", { enumerable: true, get: function () { return tenders_1.TendersService; } });
var integrations_1 = require("./services/integrations");
Object.defineProperty(exports, "IntegrationsService", { enumerable: true, get: function () { return integrations_1.IntegrationsService; } });
var documents_1 = require("./services/documents");
Object.defineProperty(exports, "DocumentsService", { enumerable: true, get: function () { return documents_1.DocumentsService; } });
// HTTP Client
var http_client_1 = require("./client/http-client");
Object.defineProperty(exports, "HttpClient", { enumerable: true, get: function () { return http_client_1.HttpClient; } });
// Types
__exportStar(require("./types"), exports);
// Default export
var scraper_sdk_2 = require("./scraper-sdk");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return scraper_sdk_2.ScraperSdk; } });
