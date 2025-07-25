'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Loader2, Key, ExternalLink, Lock } from 'lucide-react';
import { validateHuggingFaceApiKey } from '@/lib/aiService';

interface ApiKeyValidationProps {
  onValidationSuccess: (apiKey: string) => void;
  initialApiKey?: string;
}

export default function ApiKeyValidation({ onValidationSuccess, initialApiKey = '' }: ApiKeyValidationProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // No direct test for Hugging Face; rely on validateHuggingFaceApiKey

  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Hugging Face API key');
      return;
    }

    setIsValidating(true);
    setError('');
    setSuccess('');

    try {
      console.log('Validating API key...');

      // Use Hugging Face validation
      const validation = await validateHuggingFaceApiKey(apiKey.trim());
      if (validation.valid) {
        setIsValidated(true);
        setSuccess('✅ API key validated successfully! You can now proceed to create your portfolio.');
        setError('');
        onValidationSuccess(apiKey.trim());
      } else {
        setError(validation.error || 'Invalid API key');
        setIsValidated(false);
        setSuccess('');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError('Failed to validate API key. Please check your internet connection and try again.');
      setIsValidated(false);
      setSuccess('');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValidated(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">API Key Validation Required</h2>
        </div>
        <p className="text-gray-600">
          To use AI-powered features and resume parsing, please provide and validate your Hugging Face API key
        </p>
      </div>

      {/* API Key Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Key className="inline w-4 h-4 mr-2" />
          Hugging Face API Key *
        </label>
        
        <div className="flex space-x-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="Enter your Hugging Face API key (starts with 'hf_...')"
            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
              isValidated
                ? 'border-green-300 bg-green-50'
                : apiKey.trim() && !isValidated
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-gray-300'
            }`}
            style={{
              WebkitTextSecurity: 'disc',
              color: '#000000'
            } as React.CSSProperties}
            disabled={isValidated}
          />
          
          <motion.button
            type="button"
            onClick={handleValidateApiKey}
            disabled={isValidating || !apiKey.trim() || isValidated}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isValidated
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            }`}
            whileHover={!isValidated && !isValidating ? { scale: 1.05 } : {}}
            whileTap={!isValidated && !isValidating ? { scale: 0.95 } : {}}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Validating...
              </>
            ) : isValidated ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Validated
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Validate
              </>
            )}
          </motion.button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Debug Info */}
        {apiKey.trim() && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">Debug Information</summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono space-y-1">
              <div><strong>Key Length:</strong> {apiKey.length}</div>
              <div><strong>Starts with hf_:</strong> {apiKey.startsWith('hf_') ? 'Yes' : 'No'}</div>
              <div><strong>Format Valid:</strong> {/^hf_[0-9A-Za-z]{30,}$/.test(apiKey) ? 'Yes' : 'No'}</div>
              <div><strong>Validated:</strong> {isValidated ? 'Yes' : 'No'}</div>
              {debugInfo && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <div><strong>API Test Result:</strong></div>
                  <pre className="whitespace-pre-wrap text-xs mt-1">{debugInfo}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      {/* How to get API Key */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-3 flex items-center">
          <Key className="w-4 h-4 mr-2" />
          How to get your Hugging Face API Key:
        </h4>
        <ol className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>
              Visit{' '}
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Hugging Face Tokens
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Sign in with your Hugging Face account</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Click "New token" and create a read access token</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Copy the generated key (starts with "hf_")</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">5.</span>
            <span>Paste the key above and click "Validate"</span>
          </li>
        </ol>
      </div>

      {/* Troubleshooting for 404 errors */}
      {error && error.includes('404') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            404 Error - API Not Enabled
          </h4>
          <div className="text-sm text-red-700 space-y-3">
            <p><strong>Your API key format is correct, but the Generative Language API is not enabled.</strong></p>

            <div className="bg-red-100 p-3 rounded border">
              <p className="font-medium mb-2">🔧 CRITICAL: Project Mismatch Issue</p>
              <p>The most common cause is creating the API key in one project but enabling the API in a different project.</p>
            </div>

            <div>
              <p className="font-medium mb-2">Step-by-Step Fix:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Go to Google AI Studio:</strong>{' '}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline inline-flex items-center"
                  >
                    makersuite.google.com/app/apikey
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li><strong>Note the project name/ID</strong> shown next to your API key</li>
                <li>
                  <strong>Go to Google Cloud Console:</strong>{' '}
                  <a
                    href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline inline-flex items-center"
                  >
                    Enable Generative Language API
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li><strong>Switch to the SAME project</strong> (use project dropdown at top)</li>
                <li><strong>Click "Enable"</strong> button for the Generative Language API</li>
                <li><strong>Wait 2-3 minutes</strong> for activation</li>
                <li><strong>Try validating again</strong></li>
              </ol>
            </div>

            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-medium text-yellow-800">💡 Alternative Solution:</p>
              <p className="text-yellow-700">If you're still having issues, create a new API key in a fresh Google Cloud project with the API already enabled.</p>
            </div>

            <div className="bg-blue-100 p-3 rounded border border-blue-300">
              <p className="font-medium text-blue-800 mb-2">🧪 Manual Testing:</p>

              <div className="space-y-3">
                <div>
                  <p className="text-blue-700 text-xs mb-1">
                    <strong>Option 1: Simple Models Test (Recommended)</strong>
                  </p>
                  <code className="block bg-blue-50 p-2 text-xs font-mono rounded border text-blue-900 break-all">
                    {`fetch('https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY').then(r=>r.json()).then(console.log)`}
                  </code>
                  <p className="text-blue-700 text-xs mt-1">
                    Simple GET request - should return list of available models
                  </p>
                </div>

                <div>
                  <p className="text-blue-700 text-xs mb-1">
                    <strong>Option 2: Terminal Models Test</strong>
                  </p>
                  <code className="block bg-blue-50 p-2 text-xs font-mono rounded border text-blue-900 break-all">
                    {`curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"`}
                  </code>
                </div>

                <div>
                  <p className="text-blue-700 text-xs mb-1">
                    <strong>Option 3: Full Generation Test</strong>
                  </p>
                  <code className="block bg-blue-50 p-2 text-xs font-mono rounded border text-blue-900 whitespace-pre-wrap">
{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \\
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"`}
                  </code>
                </div>
              </div>

              <p className="text-blue-700 text-xs mt-2">
                <strong>Replace YOUR_API_KEY with your actual key.</strong> The models test (Option 1) is the simplest and most reliable way to verify your API key.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          Security & Privacy:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Your API key is stored only in your browser session</li>
          <li>• We never save or transmit your API key to our servers</li>
          <li>• All API calls are made directly from your browser to Hugging Face</li>
          <li>• You can regenerate your API key anytime in Hugging Face</li>
        </ul>
      </div>

      {/* Why API Key is Required */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 mb-2">Why is this required?</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• <strong>Resume Parsing:</strong> AI extracts information from uploaded resumes</li>
          <li>• <strong>GitHub Integration:</strong> Generates project descriptions from repositories</li>
          <li>• <strong>Content Enhancement:</strong> Improves and optimizes portfolio content</li>
          <li>• <strong>Quality Assurance:</strong> Ensures professional, well-written portfolios</li>
        </ul>
      </div>

      {/* Validation Status */}
      {!isValidated && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">API key validation required to proceed</span>
          </div>
        </div>
      )}

      {isValidated && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-lg text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Ready to create your portfolio!</span>
          </div>
        </div>
      )}
    </div>
  );
}
