'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { PortfolioData, Theme } from '@/types/portfolio';

interface ThemeSelectorProps {
  form: UseFormReturn<PortfolioData>;
}

const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean, professional design with soft colors and modern typography',
    preview: '/themes/modern-preview.jpg',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4facfe',
      background: '#ffffff',
      text: '#2d3748',
      cardBackground: '#f8fafc',
      divider: '#e2e8f0',
      hover: '#edf2f7',
    },
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and vibrant design perfect for creative professionals',
    preview: '/themes/creative-preview.jpg',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#45b7d1',
      background: '#f8f9fa',
      text: '#2c3e50',
      cardBackground: '#ffffff',
      divider: '#dee2e6',
      hover: '#e9ecef',
    },
  },
  {
    id: 'professional',
    name: 'Corporate Professional',
    description: 'Traditional and elegant design for business professionals',
    preview: '/themes/professional-preview.jpg',
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
      background: '#ffffff',
      text: '#2c3e50',
      cardBackground: '#f8f9fa',
      divider: '#dee2e6',
      hover: '#e9ecef',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme with neon accents for a modern tech look',
    preview: '/themes/dark-preview.jpg',
    colors: {
      primary: '#bb86fc',
      secondary: '#03dac6',
      accent: '#cf6679',
      background: '#121212',
      text: '#ffffff',
      cardBackground: '#1e1e1e',
      divider: '#333333',
      hover: '#2a2a2a',
    },
  },
  {
    id: 'pastel',
    name: 'Soft Pastel Cream',
    description: 'Warm creamy colors with soft plum accents for an elegant, approachable feel',
    preview: '/themes/pastel-preview.jpg',
    colors: {
      primary: '#6B4F41', // Warm Brown
      secondary: '#FDF6EE', // Soft Cream
      accent: '#C4A484', // Warm Beige
      background: '#FDF6EE', // Soft Cream
      text: '#6B4F41', // Warm Brown
      cardBackground: '#F5EDE3', // Light Beige
      divider: '#E8D5C4', // Soft Beige
      hover: '#F2D3C2', // Light Rose Pink
      heartGradient: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 100%)', // Cream to Beige Gradient
    },
  },
  {
    id: 'gradient',
    name: 'Gradient Magic',
    description: 'Beautiful gradients and smooth transitions for a dynamic look',
    preview: '/themes/gradient-preview.jpg',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#ffffff',
      text: '#2d3748',
      cardBackground: '#f8fafc',
      divider: '#e2e8f0',
      hover: '#edf2f7',
    },
  },
];

export default function ThemeSelector({ form }: ThemeSelectorProps) {
  const { watch, setValue } = form;
  const selectedTheme = watch('theme') || 'modern';

  const selectTheme = (themeId: string) => {
    setValue('theme', themeId);
  };

  const getSelectedTheme = () => {
    return themes.find(theme => theme.id === selectedTheme) || themes[0];
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Choose Your Portfolio Theme
        </h3>
        <p className="text-gray-600">
          Select a theme that best represents your style and personality
        </p>
      </div>

      {/* Selected Theme Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-purple-600" />
          <h4 className="text-lg font-medium text-gray-800">Selected Theme</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xl font-semibold text-gray-800 mb-2">
              {getSelectedTheme().name}
            </h5>
            <p className="text-gray-600 mb-4">
              {getSelectedTheme().description}
            </p>
            
            <div className="space-y-2">
              <h6 className="text-sm font-medium text-gray-700">Color Palette:</h6>
              <div className="flex space-x-2">
                {Object.entries(getSelectedTheme().colors).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-500 mt-1 block capitalize">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Palette className="w-8 h-8" />
              </div>
              <p className="text-sm">Theme Preview</p>
              <p className="text-xs">Live preview will be shown here</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTheme === theme.id
                ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => selectTheme(theme.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection Indicator */}
            {selectedTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Theme Preview */}
            <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full relative">
                {/* Mock Portfolio Layout */}
                <div 
                  className="w-full h-8 rounded-t-lg"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div className="p-2 space-y-1">
                  <div 
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.colors.text, opacity: 0.8, width: '60%' }}
                  />
                  <div 
                    className="h-1 rounded"
                    style={{ backgroundColor: theme.colors.text, opacity: 0.5, width: '80%' }}
                  />
                  <div 
                    className="h-1 rounded"
                    style={{ backgroundColor: theme.colors.text, opacity: 0.5, width: '40%' }}
                  />
                  <div className="flex space-x-1 mt-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">{theme.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
              
              {/* Color Palette */}
              <div className="flex space-x-1">
                {Object.values(theme.colors).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Theme Customization Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Palette className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Theme Customization</h4>
            <p className="text-blue-800 text-sm">
              Each theme can be further customized after generation. You'll be able to adjust colors, 
              fonts, spacing, and layout elements to perfectly match your personal brand.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Popular Themes */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h4 className="font-medium text-gray-800 mb-3">💡 Popular Choices</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <span className="font-medium text-purple-600">Developers:</span>
            <span className="text-gray-600 ml-1">Modern Minimalist, Dark Mode</span>
          </div>
          <div className="bg-white rounded-lg p-3">
            <span className="font-medium text-blue-600">Designers:</span>
            <span className="text-gray-600 ml-1">Creative Portfolio, Gradient Magic</span>
          </div>
          <div className="bg-white rounded-lg p-3">
            <span className="font-medium text-green-600">Business:</span>
            <span className="text-gray-600 ml-1">Corporate Professional, Soft Pastel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
