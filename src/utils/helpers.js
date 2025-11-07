/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to readable format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Failed to copy:', err);
      return false;
    }
  }
}

/**
 * Download text as file
 */
export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate report from analysis results
 */
export function generateReport(analysisResults, resumeFileName, timestamp) {
  let report = `SMART RESUME TOOL - ANALYSIS REPORT\n`;
  report += `${'='.repeat(70)}\n\n`;
  
  report += `Resume File: ${resumeFileName}\n`;
  report += `Generated: ${formatDate(timestamp)}\n`;
  report += `Analysis Type: ${analysisResults.aiEnhanced ? 'AI-Enhanced' : 'Traditional'}\n`;
  report += `${'='.repeat(70)}\n\n`;

  // Scores
  report += `OVERALL SCORES\n`;
  report += `${'-'.repeat(70)}\n`;
  report += `Overall ATS Score: ${analysisResults.scores.overall}/100\n`;
  report += `Keyword Match Score: ${analysisResults.scores.keywordMatch}%\n`;
  report += `\nScore Breakdown:\n`;
  Object.entries(analysisResults.scores.breakdown).forEach(([key, value]) => {
    report += `  ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}/100\n`;
  });
  report += `\n`;

  // Keywords
  report += `KEYWORD ANALYSIS\n`;
  report += `${'-'.repeat(70)}\n`;
  report += `Keywords Matched: ${analysisResults.keywords.matched.length}/${analysisResults.keywords.total}\n\n`;
  
  report += `Matched Keywords:\n`;
  report += analysisResults.keywords.matched.join(', ') + '\n\n';
  
  report += `Missing Keywords (Top 15):\n`;
  report += analysisResults.keywords.missing.slice(0, 15).join(', ') + '\n\n';

  // Recommendations
  report += `RECOMMENDATIONS\n`;
  report += `${'-'.repeat(70)}\n`;
  analysisResults.recommendations.forEach((rec, i) => {
    report += `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}\n`;
    report += `   ${rec.description}\n`;
    if (rec.impact) report += `   Impact: ${rec.impact}\n`;
    report += `\n`;
  });

  // AI Insights (if available)
  if (analysisResults.aiEnhanced && analysisResults.strengths) {
    report += `AI-POWERED INSIGHTS\n`;
    report += `${'-'.repeat(70)}\n`;
    
    if (analysisResults.strengths.length > 0) {
      report += `\nStrengths:\n`;
      analysisResults.strengths.forEach((strength, i) => {
        report += `${i + 1}. ${strength}\n`;
      });
    }
    
    if (analysisResults.weaknesses.length > 0) {
      report += `\nAreas for Improvement:\n`;
      analysisResults.weaknesses.forEach((weakness, i) => {
        report += `${i + 1}. ${weakness}\n`;
      });
    }
    report += `\n`;
  }

  // Metadata
  report += `RESUME STATISTICS\n`;
  report += `${'-'.repeat(70)}\n`;
  const meta = analysisResults.metadata;
  report += `Word Count: ${meta.wordCount}\n`;
  report += `Sections Detected: ${meta.estimatedSections}\n`;
  report += `Contact Information: ${meta.hasEmail ? '✓' : '✗'} Email, ${meta.hasPhone ? '✓' : '✗'} Phone\n`;
  report += `Professional Links: ${meta.hasLinkedIn ? '✓' : '✗'} LinkedIn, ${meta.hasGitHub ? '✓' : '✗'} GitHub\n`;
  report += `\n`;

  report += `${'-'.repeat(70)}\n`;
  report += `Generated by SmartResumeTool v2.0\n`;
  report += `Created by David Madison | davidmadison95@yahoo.com\n`;
  report += `https://www.linkedin.com/in/davidmadison95/\n`;

  return report;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get color for score
 */
export function getScoreColor(score) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const colors = {
    excellent: 'green',
    good: 'blue',
    'needs-work': 'orange',
    poor: 'red',
  };
  return colors[status] || 'gray';
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(text, wordsPerMinute = 200) {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId, offset = 100) {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Check if mobile device
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Class names utility (similar to clsx)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Sleep/delay utility
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delay * attempt);
    }
  }
}

/**
 * Safe JSON parse
 */
export function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Local storage helpers
 */
export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error('Storage get error:', error);
      return fallback;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};
