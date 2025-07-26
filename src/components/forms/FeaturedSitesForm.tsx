'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Trash2, Globe, Star, Link, Image } from 'lucide-react';
import { PortfolioData, FeaturedSite } from '@/types/portfolio';

interface FeaturedSitesFormProps {
  form: UseFormReturn<PortfolioData>;
}

export default function FeaturedSitesForm({ form }: FeaturedSitesFormProps) {
  const { register, watch, setValue } = form;
  const featuredSites = watch('featuredSites') || [];

  const addFeaturedSite = () => {
    const newSite: FeaturedSite = {
      id: Date.now().toString(),
      title: '',
      description: '',
      url: '',
      imageUrl: '',
      category: 'portfolio',
      featured: false,
    };
    setValue('featuredSites', [...featuredSites, newSite]);
  };

  const removeFeaturedSite = (id: string) => {
    setValue('featuredSites', featuredSites.filter(site => site.id !== id));
  };

  const updateFeaturedSite = (id: string, field: keyof FeaturedSite, value: any) => {
    const updated = featuredSites.map(site =>
      site.id === id ? { ...site, [field]: value } : site
    );
    setValue('featuredSites', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Globe className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Featured Sites & Links</h3>
        <p className="text-gray-600">
          Showcase important websites, portfolios, blogs, or other online presence (Optional)
        </p>
      </div>

      {featuredSites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
        >
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No featured sites added yet</h4>
          <p className="text-gray-500 mb-6">Add your important websites, portfolios, blogs, or social profiles</p>
          <motion.button
            onClick={addFeaturedSite}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Featured Site
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {featuredSites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Featured Site #{index + 1}
                  </h4>
                  {site.featured && (
                    <Star className="w-5 h-5 text-yellow-500 ml-2 fill-current" />
                  )}
                </div>
                <motion.button
                  onClick={() => removeFeaturedSite(site.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title *
                  </label>
                  <input
                    type="text"
                    value={site.title}
                    onChange={(e) => updateFeaturedSite(site.id, 'title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Portfolio, Tech Blog, etc."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={site.category}
                    onChange={(e) => updateFeaturedSite(site.id, 'category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="portfolio">Portfolio</option>
                    <option value="blog">Blog</option>
                    <option value="project">Project</option>
                    <option value="social">Social Profile</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Link className="inline w-4 h-4 mr-2" />
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={site.url}
                    onChange={(e) => updateFeaturedSite(site.id, 'url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="inline w-4 h-4 mr-2" />
                    Preview Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={site.imageUrl || ''}
                    onChange={(e) => updateFeaturedSite(site.id, 'imageUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/screenshot.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add a screenshot or preview image of your site
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={site.description}
                  onChange={(e) => updateFeaturedSite(site.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe what this site is about and why it's important..."
                />
              </div>

              {/* Featured Toggle */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={site.featured}
                    onChange={(e) => updateFeaturedSite(site.id, 'featured', e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as featured (will be highlighted in portfolio)
                    </span>
                  </div>
                </label>
              </div>

              {/* Preview */}
              {site.url && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm truncate"
                    >
                      {site.url}
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          <motion.button
            onClick={addFeaturedSite}
            className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Featured Site
          </motion.button>
        </div>
      )}
    </div>
  );
}
