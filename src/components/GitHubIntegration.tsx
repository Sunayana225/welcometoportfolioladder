'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Sparkles, Loader2, AlertCircle, CheckCircle, Key, Shield } from 'lucide-react';
import {
  analyzeGitHubRepository,
  analyzeUserRepositories,
  analyzeGitHubRepositoryEnhanced,
  analyzeUserRepositoriesEnhanced,
  ProjectSuggestion
} from '@/lib/githubService';
import { createAIService, validateHuggingFaceApiKey } from '@/lib/aiService';
import GeminiSetup from './GeminiSetup';

interface GitHubIntegrationProps {
  onProjectsGenerated: (projects: ProjectSuggestion[]) => void;
  huggingfaceApiKey: string;
  isApiKeyValidated: boolean;
}

export default function GitHubIntegration({ onProjectsGenerated, huggingfaceApiKey, isApiKeyValidated }: GitHubIntegrationProps) {
  const [githubInput, setGithubInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inputType, setInputType] = useState<'url' | 'username'>('url');

  const handleAnalyze = async () => {
    if (!huggingfaceApiKey.trim()) {
      setError('Please enter your Hugging Face API key in the first step');
      return;
    }

    if (!isApiKeyValidated) {
      setError('Please validate your API key in the first step');
      return;
    }

    if (!githubInput.trim()) {
      setError('Please enter a GitHub URL or username');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let projects: ProjectSuggestion[] = [];

      if (inputType === 'url') {
        // Analyze single repository with enhanced analysis
        const project = await analyzeGitHubRepositoryEnhanced(githubInput.trim(), huggingfaceApiKey);
        if (project) {
          projects = [project];
        } else {
          throw new Error('Could not analyze the repository');
        }
      } else {
        // Analyze user's repositories with enhanced analysis
        const username = githubInput.trim().replace('@', '');
        projects = await analyzeUserRepositoriesEnhanced(username, huggingfaceApiKey, 6);
        if (projects.length === 0) {
          throw new Error('No repositories found or could not analyze user repositories');
        }
      }

      onProjectsGenerated(projects);
      setSuccess(`Successfully generated ${projects.length} project${projects.length > 1 ? 's' : ''} with AI descriptions!`);
      setGithubInput('');
    } catch (error) {
      console.error('Error analyzing GitHub:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze GitHub repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAnalyze();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-purple-300 mb-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">🚀 Enhanced AI-Powered GitHub Integration</h4>
          <p className="text-sm text-gray-600">
            Advanced analysis using GitHub API + Hugging Face AI to extract comprehensive project information including dependencies, languages, and features
          </p>
        </div>
      </div>

      {/* API Key Status */}
      {isApiKeyValidated ? (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Hugging Face API key validated ✓</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Ready to analyze GitHub repositories with enhanced AI features
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Hugging Face API key required</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Please validate your Hugging Face API key in the first step to use GitHub integration
          </p>
        </div>
      )}

      {/* Enhanced Features Indicator */}
      {isApiKeyValidated && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Enhanced Analysis Features Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Package.json analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Language usage stats</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Recent commits analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Enhanced tech detection</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Type Toggle */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              inputType === 'url'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Single Repository
          </button>
          <button
            type="button"
            onClick={() => setInputType('username')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              inputType === 'username'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All User Repos
          </button>
        </div>
      </div>

      {/* GitHub Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Github className="inline w-4 h-4 mr-2" />
          {inputType === 'url' ? 'GitHub Repository URL' : 'GitHub Username'}
        </label>
        <input
          type="text"
          value={githubInput}
          onChange={(e) => setGithubInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            inputType === 'url'
              ? 'https://github.com/username/repository'
              : 'username or @username'
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        />
        <p className="text-xs text-gray-500 mt-1">
          {inputType === 'url'
            ? 'Paste the full GitHub repository URL'
            : 'Enter GitHub username to analyze all public repositories (max 6)'}
        </p>
      </div>

      {/* Action Button */}
      <motion.button
        type="button"
        onClick={handleAnalyze}
        disabled={isLoading || !huggingfaceApiKey.trim() || !githubInput.trim() || !isApiKeyValidated}
        className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Projects with AI
          </>
        )}
      </motion.button>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features List */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-700 mb-3">What this does:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Validates API key securely</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Analyzes repository structure</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Reads README files</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Extracts technologies used</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Generates 150-char descriptions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Identifies featured projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            <span>Finds live demo URLs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
