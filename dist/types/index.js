"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperSdkError = void 0;
class ScraperSdkError extends Error {
    constructor(message, status = 500, response) {
        super(message);
        this.name = 'ScraperSdkError';
        this.status = status;
        this.response = response;
    }
}
exports.ScraperSdkError = ScraperSdkError;
