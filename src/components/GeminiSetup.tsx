'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ExternalLink, Info, CheckCircle, Copy } from 'lucide-react';

export default function HuggingFaceSetup() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: "Visit Hugging Face API Key",
      description: "Go to Hugging Face API Key to get your free API key",
      action: "https://huggingface.co/settings/tokens",
      actionText: "Open API Key"
    },
    {
      title: "Sign in with Hugging Face",
      description: "Use your Hugging Face account to sign in to API Key"
    },
    {
      title: "Create API Key",
      description: "Click 'Create API Key' button to generate a new key"
    },
    {
      title: "Copy Your Key",
      description: "Copy the generated API key and paste it in the form above"
    },
    {
      title: "Validate Your Key",
      description: "Click the shield button to verify your API key works correctly"
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Need a Hugging Face API key?
          </span>
        </div>
        <motion.button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </motion.button>
      </div>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            <div className="text-sm text-blue-700 mb-4">
              Get your free Hugging Face API key in just a few steps:
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-blue-100"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {step.description}
                    </p>
                    {step.action && (
                      <a
                        href={step.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {step.actionText}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-1">
                    Free Tier Includes:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 60 requests per minute</li>
                    <li>• 1,500 requests per day</li>
                    <li>• Perfect for portfolio generation</li>
                    <li>• No credit card required</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Key className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    Keep Your API Key Safe:
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Don't share your API key publicly</li>
                    <li>• Store it securely in your browser</li>
                    <li>• You can regenerate it anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                Quick Copy - Direct Link:
              </h4>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-xs bg-white px-2 py-1 rounded border text-gray-600">
                  https://huggingface.co/settings/tokens
                </code>
                <motion.button
                  onClick={() => copyToClipboard('https://huggingface.co/settings/tokens')}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
