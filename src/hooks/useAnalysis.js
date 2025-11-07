/**
 * Custom React Hook: useAnalysis
 * Manages resume analysis state and operations
 */

import { useState, useCallback } from 'react';
import { analysisService } from '@services/analysisService';
import { claudeAPI } from '@services/claudeAPI';

export function useAnalysis() {
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [useAI, setUseAI] = useState(true);

  // Check if AI is available
  const isAIAvailable = claudeAPI.isConfigured();

  const analyzeResume = useCallback(async (resumeText, jobDescription) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      // Validate inputs
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Resume text is too short or empty');
      }

      if (!jobDescription || jobDescription.trim().length < 50) {
        throw new Error('Job description is too short or empty');
      }

      // Perform analysis
      const analysisResults = await analysisService.analyzeResume(
        resumeText,
        jobDescription,
        useAI && isAIAvailable
      );

      setResults(analysisResults);
      return analysisResults;
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [useAI, isAIAvailable]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const toggleAI = useCallback(() => {
    setUseAI(prev => !prev);
  }, []);

  return {
    results,
    isAnalyzing,
    error,
    useAI,
    isAIAvailable,
    analyzeResume,
    clearResults,
    toggleAI,
    hasResults: !!results,
  };
}

export default useAnalysis;
