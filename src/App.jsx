/**
 * Main Application Component
 * Orchestrates the entire resume analysis workflow
 */

import React, { useState } from 'react';
import { FileUpload } from './components/upload/FileUpload';
import  Button from './components/Button';
import { useFileUpload } from './hooks/useFileUpload';
import { useAnalysis } from './hooks/useAnalysis';
import { APP_CONFIG } from './config/constants';
import { scrollToElement } from './utils/helpers';
import { Sparkles, FileText } from 'lucide-react';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const fileUpload = useFileUpload();
  const analysis = useAnalysis();

  const handleAnalyze = async () => {
    if (!fileUpload.parsedContent) {
      alert('Please upload a resume first');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      alert('Please enter a detailed job description (at least 50 characters)');
      return;
    }

    try {
      await analysis.analyzeResume(
        fileUpload.parsedContent.text,
        jobDescription
      );
      
      // Scroll to results after analysis
      setTimeout(() => scrollToElement('results'), 500);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const canAnalyze = fileUpload.hasFile && jobDescription.trim().length >= 50 && !analysis.isAnalyzing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Smart<span className="text-teal-600">ResumeTool</span>
                </h1>
              </div>
              <span className="ml-2 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Real AI Powered
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-in">
            Get Your Resume <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">ATS-Ready</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Powered by Anthropic's Claude AI to optimize your resume for Applicant Tracking Systems
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <FeatureItem text="Real AI Analysis" />
            <FeatureItem text="Instant Feedback" />
            <FeatureItem text="Actionable Recommendations" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <FileUpload 
              onFileUpload={fileUpload.uploadFile}
              isLoading={fileUpload.isLoading}
              error={fileUpload.error}
            />
            
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
              disabled={analysis.isAnalyzing}
            />
          </div>

          {/* Analyze Button */}
          <div className="text-center mb-12">
            <Button
              onClick={handleAnalyze}
              loading={analysis.isAnalyzing}
              disabled={!canAnalyze}
              size="lg"
              className="shadow-lg hover:shadow-xl"
            >
              {analysis.isAnalyzing ? 'Analyzing with AI...' : 'Analyze My Resume'}
            </Button>
            
            {!analysis.isAIAvailable && (
              <p className="text-sm text-amber-600 mt-3">
                ⚠️ AI features unavailable - using traditional analysis only
              </p>
            )}
          </div>

          {/* Results Section - To be implemented */}
          {analysis.hasResults && (
            <div id="results" className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis Results</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <ScoreCard 
                    label="ATS Score"
                    score={analysis.results.scores.overall}
                    color="teal"
                  />
                  <ScoreCard 
                    label="Match Score"
                    score={analysis.results.scores.keywordMatch}
                    color="green"
                  />
                  <ScoreCard 
                    label="Keywords"
                    score={`${analysis.results.keywords.matched.length}/${analysis.results.keywords.total}`}
                    color="blue"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-semibold mb-2">{APP_CONFIG.author.name}</p>
          <p className="text-gray-400 mb-4">Data Analytics Professional | AI Enthusiast</p>
          <div className="flex justify-center gap-6">
            <a href={`mailto:${APP_CONFIG.author.email}`} className="text-teal-400 hover:text-teal-300">
              Email
            </a>
            <a href={APP_CONFIG.author.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
              LinkedIn
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © 2024 SmartResumeTool v{APP_CONFIG.version} | Built with React & Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureItem({ text }) {
  return (
    <div className="flex items-center space-x-2 text-gray-700">
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function JobDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Job Description</h3>
        <span className="text-sm text-gray-500">Step 2 of 2</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition"
        placeholder="Paste the complete job description here..."
      />
      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Pro tip: Include the entire job posting for best results</p>
        <p className="mt-1 text-xs">Character count: {value.length}</p>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, color }) {
  return (
    <div className="text-center p-6 bg-gray-50 rounded-xl">
      <div className="text-4xl font-bold text-${color}-600 mb-2">
        {typeof score === 'number' ? `${score}%` : score}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export default App;
