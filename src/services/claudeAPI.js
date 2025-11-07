/**
 * Claude API Service
 * Handles all interactions with Anthropic's Claude API
 */

import axios from 'axios';
import { CLAUDE_CONFIG, ERROR_MESSAGES } from '@config/constants';

class ClaudeAPIService {
  constructor() {
    this.apiKey = CLAUDE_CONFIG.apiKey;
    this.baseURL = CLAUDE_CONFIG.baseURL;
    this.model = CLAUDE_CONFIG.model;
    
    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 60000, // 60 seconds
    });
  }

  /**
   * Validate API configuration
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'your_api_key_here');
  }

  /**
   * Send a message to Claude
   */
  async sendMessage(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error(ERROR_MESSAGES.API_ERROR);
    }

    try {
      const response = await this.client.post('/v1/messages', {
        model: this.model,
        max_tokens: options.maxTokens || CLAUDE_CONFIG.maxTokens,
        temperature: options.temperature || CLAUDE_CONFIG.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      
      if (error.response) {
        // API returned an error
        const status = error.response.status;
        const message = error.response.data?.error?.message || 'Unknown error';
        
        if (status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Claude API service unavailable. Please try again later.');
        } else {
          throw new Error(`API Error: ${message}`);
        }
      } else if (error.request) {
        // Request made but no response
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        throw new Error(ERROR_MESSAGES.API_ERROR);
      }
    }
  }

  /**
   * Analyze resume against job description
   */
  async analyzeResume(resumeText, jobDescription) {
    const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume against the job description and provide detailed insights.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please provide a comprehensive analysis in the following JSON format:
{
  "keywordAnalysis": {
    "matched": ["keyword1", "keyword2", ...],
    "missing": ["keyword1", "keyword2", ...],
    "relevanceScore": 0-100
  },
  "atsScore": {
    "overall": 0-100,
    "breakdown": {
      "formatting": 0-100,
      "keywords": 0-100,
      "structure": 0-100,
      "contact": 0-100
    }
  },
  "strengths": [
    "Strength 1 with specific example",
    "Strength 2 with specific example"
  ],
  "weaknesses": [
    "Weakness 1 with specific improvement suggestion",
    "Weakness 2 with specific improvement suggestion"
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "keywords|formatting|content|structure",
      "title": "Recommendation title",
      "description": "Detailed recommendation",
      "example": "Concrete example of improvement"
    }
  ],
  "aiEnhancedSuggestions": [
    {
      "type": "bullet|summary|skills|achievement",
      "original": "Original text from resume",
      "improved": "AI-enhanced version with keywords",
      "explanation": "Why this improvement works"
    }
  ]
}

IMPORTANT: 
- Be specific and actionable
- Include actual keywords from the job description
- Provide concrete examples
- Focus on ATS optimization
- Response must be valid JSON only, no markdown or explanations`;

    const response = await this.sendMessage(prompt, {
      maxTokens: 4096,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    try {
      // Clean the response to extract JSON
      let jsonText = response.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const analysis = JSON.parse(jsonText);
      return analysis;
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to parse AI analysis. Please try again.');
    }
  }

  /**
   * Generate enhanced bullet points
   */
  async enhanceBulletPoints(originalBullets, jobKeywords) {
    const prompt = `You are an expert resume writer. Enhance these resume bullet points to include relevant keywords and make them more impactful.

ORIGINAL BULLET POINTS:
${originalBullets.join('\n')}

TARGET KEYWORDS TO INCORPORATE:
${jobKeywords.join(', ')}

Provide enhanced versions that:
1. Include relevant keywords naturally
2. Start with strong action verbs
3. Include quantifiable results where possible
4. Demonstrate impact and value
5. Are ATS-friendly

Return as JSON array:
[
  {
    "original": "original bullet",
    "enhanced": "enhanced bullet with keywords",
    "keywords_added": ["keyword1", "keyword2"]
  }
]`;

    const response = await this.sendMessage(prompt, { temperature: 0.7 });
    
    try {
      let jsonText = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse bullet point response:', error);
      return [];
    }
  }

  /**
   * Generate professional summary
   */
  async generateSummary(resumeText, jobDescription) {
    const prompt = `Based on this resume and job description, create a compelling professional summary (3-4 sentences) that:
1. Highlights relevant experience and skills
2. Incorporates keywords from the job description
3. Demonstrates value proposition
4. Is ATS-optimized

RESUME:
${resumeText.substring(0, 2000)}

JOB DESCRIPTION:
${jobDescription}

Return only the professional summary text, no additional formatting or explanation.`;

    return await this.sendMessage(prompt, { 
      maxTokens: 500,
      temperature: 0.7 
    });
  }

  /**
   * Get personalized career advice
   */
  async getCareerAdvice(resumeText, targetRole) {
    const prompt = `As a career advisor, provide personalized advice for someone with this background targeting this role:

BACKGROUND:
${resumeText.substring(0, 2000)}

TARGET ROLE:
${targetRole}

Provide 3-5 actionable pieces of advice for standing out in applications and interviews.`;

    return await this.sendMessage(prompt, { 
      maxTokens: 1000,
      temperature: 0.8 
    });
  }
}

// Export singleton instance
export const claudeAPI = new ClaudeAPIService();

// Export class for testing
export default ClaudeAPIService;
