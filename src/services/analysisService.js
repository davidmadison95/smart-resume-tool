/**
 * Resume Analysis Service
 * Combines traditional algorithmic analysis with AI-powered insights
 */

import { claudeAPI } from './claudeAPI';
import { ANALYSIS_CONFIG, SCORING_WEIGHTS } from '@config/constants';

class AnalysisService {
  /**
   * Perform complete resume analysis
   */
  async analyzeResume(resumeText, jobDescription, useAI = true) {
    try {
      // Start with traditional analysis (fast, always available)
      const traditionalAnalysis = this.performTraditionalAnalysis(
        resumeText,
        jobDescription
      );

      // If AI is enabled and configured, enhance with AI analysis
      let aiAnalysis = null;
      if (useAI && claudeAPI.isConfigured()) {
        try {
          aiAnalysis = await claudeAPI.analyzeResume(resumeText, jobDescription);
        } catch (error) {
          console.error('AI analysis failed, using traditional analysis only:', error);
          // Continue with traditional analysis if AI fails
        }
      }

      // Merge analyses
      return this.mergeAnalyses(traditionalAnalysis, aiAnalysis);
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  /**
   * Traditional algorithmic analysis (always works, no API needed)
   */
  performTraditionalAnalysis(resumeText, jobDescription) {
    // Extract keywords from both texts
    const resumeKeywords = this.extractKeywords(resumeText);
    const jobKeywords = this.extractKeywords(jobDescription);

    // Find matches and gaps
    const matchedKeywords = jobKeywords.filter(jobKw =>
      resumeKeywords.some(resKw => resKw.toLowerCase() === jobKw.toLowerCase())
    );

    const missingKeywords = jobKeywords.filter(
      jobKw => !matchedKeywords.some(mk => mk.toLowerCase() === jobKw.toLowerCase())
    );

    // Calculate scores
    const keywordMatchScore = jobKeywords.length > 0
      ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      : 0;

    const atsScore = this.calculateATSScore(
      resumeText,
      matchedKeywords.length,
      jobKeywords.length
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      resumeText,
      missingKeywords,
      atsScore
    );

    // Generate insights
    const insights = this.generateInsights(resumeText, matchedKeywords, missingKeywords);

    // Extract metadata
    const metadata = this.extractMetadata(resumeText);

    return {
      scores: {
        overall: atsScore,
        keywordMatch: keywordMatchScore,
        breakdown: this.calculateScoreBreakdown(resumeText, matchedKeywords, jobKeywords),
      },
      keywords: {
        matched: matchedKeywords,
        missing: missingKeywords.slice(0, 15), // Limit to top 15 missing
        total: jobKeywords.length,
      },
      recommendations,
      insights,
      metadata,
      analysisType: 'traditional',
    };
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    if (!text || text.length < 10) return [];

    // Normalize text
    let normalizedText = text.toLowerCase();

    // Handle special technical terms
    const technicalMappings = {
      'react.js': 'reactjs',
      'node.js': 'nodejs',
      'vue.js': 'vuejs',
      'c++': 'cplusplus',
      'c#': 'csharp',
      '.net': 'dotnet',
    };

    Object.entries(technicalMappings).forEach(([original, normalized]) => {
      normalizedText = normalizedText.replace(new RegExp(original, 'gi'), normalized);
    });

    // Extract words
    const words = normalizedText
      .replace(/[^\w\s+#.-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !ANALYSIS_CONFIG.stopWords.has(word));

    // Count frequency
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Extract multi-word phrases (bigrams and trigrams)
    const phrases = this.extractPhrases(normalizedText);

    // Combine and sort by frequency
    const allTerms = [
      ...Object.keys(wordFreq),
      ...phrases,
    ];

    const termFreq = {};
    allTerms.forEach(term => {
      termFreq[term] = (termFreq[term] || 0) + 1;
    });

    // Get top keywords
    const keywords = Object.entries(termFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, ANALYSIS_CONFIG.maxKeywords)
      .map(entry => entry[0]);

    return keywords;
  }

  /**
   * Extract multi-word phrases
   */
  extractPhrases(text) {
    const phrases = [];
    const words = text.split(/\s+/);

    // Common technical phrases and skills
    const technicalPhrases = [
      'machine learning',
      'data analysis',
      'project management',
      'full stack',
      'front end',
      'back end',
      'software development',
      'agile methodology',
      'version control',
      'database management',
      'api development',
      'cloud computing',
      'data visualization',
      'business intelligence',
      'quality assurance',
      'user experience',
      'customer service',
      'team leadership',
    ];

    technicalPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        phrases.push(phrase);
      }
    });

    return phrases;
  }

  /**
   * Calculate ATS score
   */
  calculateATSScore(resumeText, matchedCount, totalKeywords) {
    let score = 0;

    // Keyword matching (40 points)
    if (totalKeywords > 0) {
      score += (matchedCount / totalKeywords) * SCORING_WEIGHTS.KEYWORD_MATCH;
    }

    // Format quality (25 points)
    const formatScore = this.assessFormat(resumeText);
    score += formatScore * (SCORING_WEIGHTS.ATS_FORMAT / 100);

    // Content structure (20 points)
    const structureScore = this.assessStructure(resumeText);
    score += structureScore * (SCORING_WEIGHTS.CONTENT_STRUCTURE / 100);

    // Contact information (10 points)
    const contactScore = this.assessContactInfo(resumeText);
    score += contactScore * (SCORING_WEIGHTS.CONTACT_INFO / 100);

    // Measurable results (5 points)
    const resultsScore = this.assessMeasurableResults(resumeText);
    score += resultsScore * (SCORING_WEIGHTS.MEASURABLE_RESULTS / 100);

    return Math.min(Math.round(score), 100);
  }

  /**
   * Assess resume format
   */
  assessFormat(text) {
    let score = 0;

    // Length check (not too short, not too long)
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 1000) score += 30;
    else if (wordCount >= 200 || wordCount <= 1500) score += 20;
    else score += 10;

    // Has dates/years
    if (/\d{4}/.test(text)) score += 20;

    // Has bullet points
    if (/[•\-\*]/.test(text)) score += 20;

    // Consistent formatting indicators
    if (text.includes('\n')) score += 15;

    // No excessive special characters or encoding issues
    const specialCharRatio = (text.match(/[^\w\s.,;:()\-]/g) || []).length / text.length;
    if (specialCharRatio < 0.05) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Assess resume structure
   */
  assessStructure(text) {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Key sections present
    if (/experience|employment|work history/i.test(lowerText)) score += 25;
    if (/education|academic/i.test(lowerText)) score += 25;
    if (/skills|competencies|expertise/i.test(lowerText)) score += 25;
    if (/summary|objective|profile/i.test(lowerText)) score += 15;

    // Section organization (headers likely present)
    const potentialHeaders = lowerText.match(/\n[a-z\s]{3,30}\n/g) || [];
    if (potentialHeaders.length >= 3) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Assess contact information
   */
  assessContactInfo(text) {
    let score = 0;

    // Email
    if (/@[\w.-]+\.\w{2,}/.test(text)) score += 35;

    // Phone
    if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 35;

    // LinkedIn
    if (/linkedin\.com/i.test(text)) score += 15;

    // Other professional links (GitHub, portfolio, etc.)
    if (/github\.com|portfolio|website|blog/i.test(text)) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Assess measurable results
   */
  assessMeasurableResults(text) {
    let score = 0;

    // Numbers/percentages
    const numbers = text.match(/\d+[%$]?/g) || [];
    if (numbers.length >= 5) score += 40;
    else if (numbers.length >= 3) score += 25;
    else if (numbers.length >= 1) score += 15;

    // Action verbs
    const actionVerbs = [
      'achieved', 'improved', 'increased', 'decreased', 'reduced', 'managed',
      'led', 'developed', 'implemented', 'created', 'designed', 'optimized',
    ];
    const foundVerbs = actionVerbs.filter(verb =>
      new RegExp(verb, 'i').test(text)
    );
    score += Math.min(foundVerbs.length * 10, 60);

    return Math.min(score, 100);
  }

  /**
   * Calculate detailed score breakdown
   */
  calculateScoreBreakdown(resumeText, matchedKeywords, allKeywords) {
    return {
      keywords: allKeywords.length > 0
        ? Math.round((matchedKeywords.length / allKeywords.length) * 100)
        : 0,
      formatting: this.assessFormat(resumeText),
      structure: this.assessStructure(resumeText),
      contact: this.assessContactInfo(resumeText),
      results: this.assessMeasurableResults(resumeText),
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(resumeText, missingKeywords, atsScore) {
    const recommendations = [];

    // Critical: Missing keywords
    if (missingKeywords.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'keywords',
        title: 'Add Missing Keywords',
        description: `Incorporate these important keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
        impact: 'High - Significantly improves ATS compatibility',
      });
    }

    // Structure improvements
    if (atsScore < 70) {
      recommendations.push({
        priority: 'high',
        category: 'structure',
        title: 'Improve Resume Structure',
        description: 'Use clear section headers: Professional Summary, Experience, Education, Skills',
        impact: 'High - Makes resume easier for ATS to parse',
      });
    }

    // Contact information
    if (!/@/.test(resumeText)) {
      recommendations.push({
        priority: 'high',
        category: 'formatting',
        title: 'Add Contact Information',
        description: 'Include your email address and phone number at the top of your resume',
        impact: 'Critical - Required for employer contact',
      });
    }

    // Quantifiable achievements
    const numbers = (resumeText.match(/\d+[%$]?/g) || []).length;
    if (numbers < 3) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: 'Add Quantifiable Achievements',
        description: 'Include numbers, percentages, and metrics to demonstrate impact (e.g., "Increased sales by 25%")',
        impact: 'Medium - Makes accomplishments more concrete',
      });
    }

    // Action verbs
    recommendations.push({
      priority: 'medium',
      category: 'content',
      title: 'Use Strong Action Verbs',
      description: 'Start bullet points with powerful verbs like "Managed", "Developed", "Achieved", "Optimized"',
      impact: 'Medium - Creates stronger impression',
    });

    // LinkedIn/professional presence
    if (!/linkedin\.com/i.test(resumeText)) {
      recommendations.push({
        priority: 'low',
        category: 'formatting',
        title: 'Add LinkedIn Profile',
        description: 'Include your LinkedIn profile URL to show professional online presence',
        impact: 'Low - Provides additional context for recruiters',
      });
    }

    return recommendations;
  }

  /**
   * Generate insights
   */
  generateInsights(resumeText, matchedKeywords, missingKeywords) {
    const wordCount = resumeText.split(/\s+/).length;
    const totalKeywords = matchedKeywords.length + missingKeywords.length;
    const matchRate = totalKeywords > 0
      ? (matchedKeywords.length / totalKeywords) * 100
      : 0;

    return [
      {
        label: 'Keyword Match Rate',
        value: `${matchRate.toFixed(1)}%`,
        description: 'Percentage of job keywords found in your resume',
        status: matchRate >= 70 ? 'excellent' : matchRate >= 50 ? 'good' : 'needs-work',
      },
      {
        label: 'Resume Length',
        value: `${wordCount} words`,
        description: 'Ideal length is 400-800 words for most positions',
        status: wordCount >= 400 && wordCount <= 800 ? 'excellent' : wordCount >= 300 && wordCount <= 1000 ? 'good' : 'needs-work',
      },
      {
        label: 'Skills Alignment',
        value: matchedKeywords.length > 10 ? 'Strong' : matchedKeywords.length > 5 ? 'Moderate' : 'Weak',
        description: 'How well your skills align with job requirements',
        status: matchedKeywords.length > 10 ? 'excellent' : matchedKeywords.length > 5 ? 'good' : 'needs-work',
      },
      {
        label: 'ATS Readability',
        value: /[•\-]/.test(resumeText) ? 'Good' : 'Needs Work',
        description: 'Use bullet points and clear formatting for better ATS parsing',
        status: /[•\-]/.test(resumeText) ? 'good' : 'needs-work',
      },
    ];
  }

  /**
   * Extract metadata from resume
   */
  extractMetadata(text) {
    return {
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
      wordCount: text.split(/\s+/).length,
      hasYears: /\d{4}/.test(text),
      hasBulletPoints: /[•\-\*]/.test(text),
      estimatedSections: this.countSections(text),
    };
  }

  /**
   * Count sections in resume
   */
  countSections(text) {
    const commonHeaders = [
      /experience|employment|work history/i,
      /education|academic/i,
      /skills|competencies/i,
      /summary|objective|profile/i,
      /certifications|licenses/i,
      /projects/i,
      /awards|achievements/i,
    ];

    return commonHeaders.filter(pattern => pattern.test(text)).length;
  }

  /**
   * Merge traditional and AI analyses
   */
  mergeAnalyses(traditional, ai) {
    if (!ai) {
      return {
        ...traditional,
        aiEnhanced: false,
      };
    }

    // Merge keyword analysis
    const mergedKeywords = {
      matched: [...new Set([...traditional.keywords.matched, ...ai.keywordAnalysis.matched])],
      missing: [...new Set([...traditional.keywords.missing, ...ai.keywordAnalysis.missing])],
      total: traditional.keywords.total,
    };

    // Use AI scores if available, otherwise use traditional
    const mergedScores = {
      overall: ai.atsScore?.overall || traditional.scores.overall,
      keywordMatch: ai.keywordAnalysis?.relevanceScore || traditional.scores.keywordMatch,
      breakdown: ai.atsScore?.breakdown || traditional.scores.breakdown,
    };

    return {
      scores: mergedScores,
      keywords: mergedKeywords,
      recommendations: [...traditional.recommendations, ...ai.recommendations],
      insights: traditional.insights,
      strengths: ai.strengths || [],
      weaknesses: ai.weaknesses || [],
      aiSuggestions: ai.aiEnhancedSuggestions || [],
      metadata: traditional.metadata,
      analysisType: 'hybrid',
      aiEnhanced: true,
    };
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();

// Export class for testing
export default AnalysisService;
