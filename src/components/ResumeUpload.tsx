'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { extractResumeText, parseResumeWithAI, convertResumeToPortfolioData, ParsedResumeData } from '@/lib/resumeParser';
import { checkPyresparserAvailability, parseResumeWithPyresparser, convertPyresparserToPortfolioData } from '@/lib/pyresparserService';

interface ResumeUploadProps {
  onDataExtracted: (data: any) => void;
  huggingfaceApiKey: string;
  onSkip?: () => void;
}

export default function ResumeUpload({ onDataExtracted, huggingfaceApiKey, onSkip }: ResumeUploadProps) {
  // Resume parsing temporarily disabled for testing
  const RESUME_PARSING_DISABLED = true;

  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [pyresparserAvailable, setPyresparserAvailable] = useState<boolean | null>(null);

  // Check pyresparser availability on component mount (disabled for testing)
  React.useEffect(() => {
    if (!RESUME_PARSING_DISABLED) {
      checkPyresparserAvailability().then(setPyresparserAvailable);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setIsUploading(true);
    setUploadedFile(file);

    try {
      // Extract text from resume
      const text = await extractResumeText(file);
      setExtractedText(text);
      setSuccess(`✅ Resume uploaded successfully! File: ${file.name}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleParseWithPyresparser = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume file first');
      return;
    }

    setIsParsing(true);
    setError('');

    try {
      const parsed = await parseResumeWithPyresparser(uploadedFile);

      // Convert to portfolio format and pass to parent
      const portfolioData = convertPyresparserToPortfolioData(parsed);
      onDataExtracted(portfolioData);

      setSuccess('🎉 Resume parsed successfully with pyresparser! Portfolio fields have been filled.');
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume with pyresparser');
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseWithAI = async () => {
    if (!extractedText || !huggingfaceApiKey) {
      setError('Please upload a resume and provide a valid Hugging Face API key');
      return;
    }

    setIsParsing(true);
    setError('');

    try {
      const parsed = await parseResumeWithAI(extractedText, huggingfaceApiKey);
      setParsedData(parsed);

      // Convert to portfolio format and pass to parent
      const portfolioData = convertResumeToPortfolioData(parsed);
      onDataExtracted(portfolioData);

      setSuccess('🎉 Resume parsed successfully with Hugging Face AI! Portfolio fields have been filled.');
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume with AI');
    } finally {
      setIsParsing(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setExtractedText('');
    setParsedData(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-6">
      {/* Resume Parsing Disabled Notice */}
      {RESUME_PARSING_DISABLED && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Resume Parsing Temporarily Disabled</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Resume parsing is currently disabled for testing. You can skip this step and manually enter your information in the following forms.
          </p>
          <div className="mt-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Skip Resume Upload & Continue Manually
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          🚀 Quick Start: Upload Your Resume
        </h3>
        <p className="text-gray-600 text-sm">
          Upload your resume and let AI automatically fill your portfolio fields
        </p>
      </div>

      {/* Drag and Drop Area */}
      {!RESUME_PARSING_DISABLED && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive
              ? 'border-purple-400 bg-purple-50'
              : uploadedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-25'
            }
          `}
        >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin" />
              <p className="text-purple-600 font-medium">Processing your resume...</p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-3">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearUpload();
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {!isParsing && (
                <div className="flex flex-col space-y-3">
                  {/* Primary: pyresparser button */}
                  {pyresparserAvailable && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleParseWithPyresparser();
                      }}
                      className="flex items-center space-x-2 mx-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText className="w-5 h-5" />
                      <span>Parse with Enhanced Parser (Recommended)</span>
                    </motion.button>
                  )}

                  {/* Fallback: Hugging Face AI button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleParseWithAI();
                    }}
                    disabled={!huggingfaceApiKey}
                    className="flex items-center space-x-2 mx-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{pyresparserAvailable ? 'Parse with Hugging Face AI (Fallback)' : 'Parse with Hugging Face AI'}</span>
                  </motion.button>
                </div>
              )}
              
              {isParsing && (
                <div className="flex items-center space-x-2 justify-center text-purple-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Parsing resume...</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports PDF, DOCX, DOC, and TXT files
                </p>
              </div>
              <div className="text-xs text-gray-400">
                Supports PDF, DOCX, DOC, and TXT files (max 10MB)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            {error.includes('Failed to parse resume with AI') && onSkip && (
              <div className="mt-3 p-3 bg-red-100 rounded-lg">
                <p className="text-xs text-red-600 mb-2">
                  Having trouble with AI parsing? You can skip this step and fill your portfolio manually.
                </p>
                <motion.button
                  onClick={onSkip}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip & Fill Manually
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parser Status */}
      <div className="space-y-3">
        {/* pyresparser status */}
        {pyresparserAvailable !== null && (
          <div className={`p-3 rounded-lg border ${
            pyresparserAvailable
              ? 'bg-green-50 border-green-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className={`flex items-center space-x-2 ${
              pyresparserAvailable ? 'text-green-700' : 'text-orange-700'
            }`}>
              {pyresparserAvailable ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                Enhanced Parser: {pyresparserAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
            {pyresparserAvailable ? (
              <p className="text-xs text-green-600 mt-1">
                Supports PDF, DOCX, and TXT files with comprehensive skills database (3000+ skills) + URL extraction
              </p>
            ) : (
              <p className="text-xs text-orange-600 mt-1">
                Advanced parsing unavailable. Using Hugging Face AI as fallback.
              </p>
            )}
          </div>
        )}

        {/* Hugging Face API key requirement */}
        {!huggingfaceApiKey && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Hugging Face API key required for AI parsing
              </span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Please provide your Hugging Face API key in the GitHub Integration section to use AI-powered resume parsing.
            </p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
        <div className="space-y-1 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Upload your resume (PDF, DOCX, DOC, or TXT)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>{pyresparserAvailable ? 'Enhanced parser or AI extracts' : 'AI extracts'} personal info, experience, education, skills, and URLs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Portfolio fields are automatically filled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Review and edit the extracted information</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Generate your professional portfolio</span>
          </div>
        </div>
      </div>

      {/* Skip Option */}
      {onSkip && (
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          <motion.button
            onClick={onSkip}
            className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip Resume Upload & Fill Manually
          </motion.button>
          <p className="text-xs text-gray-500 mt-2">
            You can always upload your resume later to auto-fill fields
          </p>
        </div>
      )}
    </div>
  );
}
