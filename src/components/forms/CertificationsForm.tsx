'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Award, ExternalLink, Calendar, Building } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface CertificationsFormProps {
  form: UseFormReturn<PortfolioData>;
}

export default function CertificationsForm({ form }: CertificationsFormProps) {
  const { watch, setValue, formState: { errors } } = form;
  const certifications = watch('certifications') || [];

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialUrl: '',
    };
    setValue('certifications', [...certifications, newCertification]);
  };

  const removeCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index);
    setValue('certifications', updated);
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setValue('certifications', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Certifications & Credentials</h2>
        <p className="text-gray-600">
          Showcase your professional certifications, licenses, and credentials
        </p>
      </div>

      <AnimatePresence>
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Certification {index + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Certification Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={certification.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                {errors.certifications?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Issuing Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={certification.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                {errors.certifications?.[index]?.issuer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.issuer?.message}
                  </p>
                )}
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Issue Date *
                </label>
                <input
                  type="month"
                  value={certification.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                {errors.certifications?.[index]?.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.date?.message}
                  </p>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Expiry Date (Optional)
                </label>
                <input
                  type="month"
                  value={certification.expiryDate || ''}
                  onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if certification doesn't expire
                </p>
              </div>

              {/* Credential URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ExternalLink className="inline w-4 h-4 mr-1" />
                  Credential URL *
                </label>
                <input
                  type="url"
                  value={certification.credentialUrl}
                  onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                {errors.certifications?.[index]?.credentialUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.credentialUrl?.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Link to verify your certification (Credly, issuer website, etc.)
                </p>
              </div>
            </div>

            {/* Preview */}
            {certification.name && certification.issuer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800">{certification.name}</h4>
                <p className="text-sm text-gray-600">
                  {certification.issuer} • {certification.date && new Date(certification.date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  {certification.expiryDate && (
                    <span className="text-orange-600">
                      {' '}• Expires {new Date(certification.expiryDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                </p>
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Credential</span>
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Certification Button */}
      <motion.button
        type="button"
        onClick={addCertification}
        className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Certification</span>
      </motion.button>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips for Certifications:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include professional certifications relevant to your field</li>
          <li>• Add links to verify credentials (Credly, issuer websites)</li>
          <li>• List certifications in order of relevance or recency</li>
          <li>• Include expiry dates to show current status</li>
          <li>• Consider adding course completion certificates for major platforms</li>
        </ul>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No certifications added yet</p>
          <p className="text-sm">Click "Add Certification" to showcase your credentials</p>
        </div>
      )}
    </div>
  );
}
