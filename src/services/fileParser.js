/**
 * File Parser Service
 * Handles parsing of PDF, DOCX, DOC, and TXT files
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { FILE_CONFIG, ERROR_MESSAGES } from '@config/constants';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

class FileParserService {
  /**
   * Validate file before parsing
   */
  validateFile(file) {
    // Check file size
    if (file.size > FILE_CONFIG.maxSize) {
      throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    const hasValidExtension = FILE_CONFIG.supportedFormats.some(ext =>
      fileName.endsWith(ext)
    );
    const hasValidMimeType = FILE_CONFIG.supportedMimeTypes.includes(file.type);

    if (!hasValidExtension && !hasValidMimeType) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    return true;
  }

  /**
   * Parse file based on type
   */
  async parseFile(file, onProgress = null) {
    try {
      this.validateFile(file);

      const fileName = file.name.toLowerCase();
      const fileType = file.type;

      // Report initial progress
      if (onProgress) onProgress({ stage: 'reading', progress: 10 });

      let text = '';

      if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
        text = await this.parsePDF(file, onProgress);
      } else if (
        fileName.endsWith('.docx') ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        text = await this.parseDOCX(file, onProgress);
      } else if (fileName.endsWith('.doc') || fileType === 'application/msword') {
        // Try DOCX parser for older .doc files
        try {
          text = await this.parseDOCX(file, onProgress);
        } catch (error) {
          throw new Error(
            'Older .DOC format detected. Please save as .DOCX or .PDF for best results.'
          );
        }
      } else if (fileName.endsWith('.txt') || fileType === 'text/plain') {
        text = await this.parseTXT(file, onProgress);
      } else {
        throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
      }

      // Final validation
      if (!text || text.trim().length < 50) {
        throw new Error(
          'The file appears to be empty or too short. Please check the file content.'
        );
      }

      if (onProgress) onProgress({ stage: 'complete', progress: 100 });

      return {
        text: text.trim(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        wordCount: this.countWords(text),
        parsedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('File parsing error:', error);
      if (onProgress) onProgress({ stage: 'error', progress: 0, error: error.message });
      throw error;
    }
  }

  /**
   * Parse PDF file
   */
  async parsePDF(file, onProgress = null) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (onProgress) onProgress({ stage: 'parsing', progress: 30 });

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';
      const totalPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';

        // Report progress
        if (onProgress) {
          const progress = 30 + Math.floor((pageNum / totalPages) * 60);
          onProgress({ stage: 'parsing', progress, page: pageNum, totalPages });
        }
      }

      return fullText;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(
        ERROR_MESSAGES.PARSE_ERROR + ' (PDF error: ' + error.message + ')'
      );
    }
  }

  /**
   * Parse DOCX file
   */
  async parseDOCX(file, onProgress = null) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (onProgress) onProgress({ stage: 'parsing', progress: 50 });

      const result = await mammoth.extractRawText({ arrayBuffer });

      if (onProgress) onProgress({ stage: 'parsing', progress: 90 });

      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text content found in document');
      }

      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error(
        ERROR_MESSAGES.PARSE_ERROR + ' (DOCX error: ' + error.message + ')'
      );
    }
  }

  /**
   * Parse TXT file
   */
  async parseTXT(file, onProgress = null) {
    try {
      if (onProgress) onProgress({ stage: 'parsing', progress: 50 });

      const text = await file.text();

      if (onProgress) onProgress({ stage: 'parsing', progress: 90 });

      return text;
    } catch (error) {
      console.error('TXT parsing error:', error);
      throw new Error('Failed to read text file: ' + error.message);
    }
  }

  /**
   * Count words in text
   */
  countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Extract metadata from parsed file
   */
  extractMetadata(text) {
    const metadata = {
      hasEmail: /@[\w.-]+\.\w+/.test(text),
      hasPhone: /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text),
      hasLinkedIn: /linkedin\.com/i.test(text),
      hasGitHub: /github\.com/i.test(text),
      hasSections: {
        experience: /experience/i.test(text),
        education: /education/i.test(text),
        skills: /skills/i.test(text),
        summary: /summary|objective/i.test(text),
      },
      wordCount: this.countWords(text),
      hasYears: /\d{4}/.test(text),
      hasBulletPoints: /[•\-\*]/.test(text),
    };

    return metadata;
  }

  /**
   * Get file info without parsing
   */
  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      isValid: FILE_CONFIG.supportedFormats.some(ext =>
        file.name.toLowerCase().endsWith(ext)
      ),
    };
  }
}

// Export singleton instance
export const fileParser = new FileParserService();

// Export class for testing
export default FileParserService;
