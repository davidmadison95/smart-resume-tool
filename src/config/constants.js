/**
 * Application Configuration
 * Centralized configuration for SmartResumeTool
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'SmartResumeTool',
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  author: {
    name: 'David Madison',
    email: 'davidmadison95@yahoo.com',
    linkedin: 'https://www.linkedin.com/in/davidmadison95/',
  },
};

export const FILE_CONFIG = {
  maxSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  supportedFormats: ['.pdf', '.doc', '.docx', '.txt'],
  supportedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

export const CLAUDE_CONFIG = {
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4096,
  temperature: 0.7,
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.anthropic.com',
};

export const ANALYSIS_CONFIG = {
  minResumeLength: 50,
  minJobDescLength: 50,
  maxKeywords: 30,
  stopWords: new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
    'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
    'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    'work', 'working', 'experience', 'years', 'year', 'ability', 'skills',
    'skill', 'required', 'requirements', 'looking', 'candidate', 'position',
    'job', 'role', 'us', 'our', 'team', 'company', 'business',
  ]),
};

export const SCORING_WEIGHTS = {
  KEYWORD_MATCH: 40,
  ATS_FORMAT: 25,
  CONTENT_STRUCTURE: 20,
  CONTACT_INFO: 10,
  MEASURABLE_RESULTS: 5,
};

export const UI_CONFIG = {
  animationDuration: 1500,
  toastDuration: 3000,
  progressSteps: 30,
};

export const FEATURE_FLAGS = {
  enableAISuggestions: import.meta.env.VITE_ENABLE_AI_SUGGESTIONS !== 'false',
  enableExport: import.meta.env.VITE_ENABLE_EXPORT !== 'false',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FORMAT: 'Please upload a PDF, DOC, DOCX, or TXT file',
  PARSE_ERROR: 'Failed to parse file. Please ensure it is not corrupted or password-protected',
  NO_RESUME: 'Please upload a resume first',
  NO_JOB_DESC: 'Please enter a job description',
  JOB_DESC_TOO_SHORT: 'Please enter a more detailed job description (at least 50 characters)',
  ANALYSIS_ERROR: 'An error occurred during analysis. Please try again',
  API_ERROR: 'Failed to connect to AI service. Please check your API key',
  NETWORK_ERROR: 'Network error. Please check your internet connection',
};

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'Resume uploaded successfully',
  ANALYSIS_COMPLETE: 'Analysis complete!',
  REPORT_EXPORTED: 'Report exported successfully',
  COPIED: 'Copied to clipboard!',
};
