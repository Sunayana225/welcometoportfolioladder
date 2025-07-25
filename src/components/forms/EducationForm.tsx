'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, GraduationCap, Calendar, Award } from 'lucide-react';
import { PortfolioData, Education, Certification } from '@/types/portfolio';

interface EducationFormProps {
  form: UseFormReturn<PortfolioData>;
}

export default function EducationForm({ form }: EducationFormProps) {
  const { watch, setValue } = form;
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: '',
  });
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialUrl: '',
  });
  
  const education = watch('education') || [];
  const certifications = watch('certifications') || [];

  const addEducation = () => {
    if (newEducation.institution.trim() && newEducation.degree.trim()) {
      const edu: Education = {
        id: Date.now().toString(),
        institution: newEducation.institution.trim(),
        degree: newEducation.degree.trim(),
        field: newEducation.field.trim(),
        startDate: newEducation.startDate,
        endDate: newEducation.current ? undefined : newEducation.endDate,
        current: newEducation.current,
        gpa: newEducation.gpa.trim() || undefined,
        description: newEducation.description.trim() || undefined,
      };
      
      setValue('education', [...education, edu]);
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        description: '',
      });
      setShowAddEducation(false);
    }
  };

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      const cert: Certification = {
        id: Date.now().toString(),
        name: newCertification.name.trim(),
        issuer: newCertification.issuer.trim(),
        date: newCertification.date,
        expiryDate: newCertification.expiryDate || undefined,
        credentialUrl: newCertification.credentialUrl.trim() || undefined,
      };
      
      setValue('certifications', [...certifications, cert]);
      setNewCertification({
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialUrl: '',
      });
      setShowAddCertification(false);
    }
  };

  const removeEducation = (id: string) => {
    setValue('education', education.filter(edu => edu.id !== id));
  };

  const removeCertification = (id: string) => {
    setValue('certifications', certifications.filter(cert => cert.id !== id));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Education & Certifications
        </h3>
        <p className="text-gray-600">
          Add your educational background and professional certifications
        </p>
      </div>

      {/* Education Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-medium text-gray-800">Education</h4>
          {!showAddEducation && (
            <motion.button
              type="button"
              onClick={() => setShowAddEducation(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </motion.button>
          )}
        </div>

        {/* Add Education Form */}
        <AnimatePresence>
          {showAddEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
            >
              <h5 className="text-lg font-medium text-gray-800 mb-4">Add Education</h5>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      placeholder="University Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      placeholder="Bachelor's, Master's, PhD, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={newEducation.field}
                      onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                      placeholder="Computer Science, Engineering, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GPA (optional)
                    </label>
                    <input
                      type="text"
                      value={newEducation.gpa}
                      onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                      placeholder="3.8/4.0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={newEducation.startDate}
                      onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={newEducation.endDate}
                      onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                      disabled={newEducation.current}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current-education"
                    checked={newEducation.current}
                    onChange={(e) => setNewEducation({ 
                      ...newEducation, 
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : newEducation.endDate
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="current-education" className="ml-2 text-sm text-gray-700">
                    Currently studying here
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                    rows={3}
                    placeholder="Relevant coursework, achievements, activities..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <motion.button
                  type="button"
                  onClick={addEducation}
                  disabled={!newEducation.institution.trim() || !newEducation.degree.trim()}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setShowAddEducation(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Education List */}
        <div className="space-y-4">
          <AnimatePresence>
            {education.map(edu => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <h5 className="text-lg font-medium text-gray-800">{edu.degree}</h5>
                      {edu.current && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <h6 className="text-md font-medium text-purple-600 mb-2">{edu.institution}</h6>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                      </div>
                      {edu.gpa && (
                        <div>
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                    
                    {edu.field && (
                      <p className="text-gray-600 mb-2">Field: {edu.field}</p>
                    )}
                    
                    {edu.description && (
                      <p className="text-gray-600 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                  
                  <motion.button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-medium text-gray-800">Certifications</h4>
          {!showAddCertification && (
            <motion.button
              type="button"
              onClick={() => setShowAddCertification(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </motion.button>
          )}
        </div>

        {/* Add Certification Form */}
        <AnimatePresence>
          {showAddCertification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300"
            >
              <h5 className="text-lg font-medium text-gray-800 mb-4">Add Certification</h5>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                      placeholder="AWS Certified Developer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="month"
                      value={newCertification.date}
                      onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (optional)
                    </label>
                    <input
                      type="month"
                      value={newCertification.expiryDate}
                      onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newCertification.credentialUrl}
                    onChange={(e) => setNewCertification({ ...newCertification, credentialUrl: e.target.value })}
                    placeholder="https://credential-url.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <motion.button
                  type="button"
                  onClick={addCertification}
                  disabled={!newCertification.name.trim() || !newCertification.issuer.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setShowAddCertification(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {certifications.map(cert => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <h5 className="font-medium text-gray-800">{cert.name}</h5>
                    </div>
                    
                    <p className="text-blue-600 text-sm mb-2">{cert.issuer}</p>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      Issued: {formatDate(cert.date)}
                      {cert.expiryDate && (
                        <span> • Expires: {formatDate(cert.expiryDate)}</span>
                      )}
                    </div>
                    
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200"
                      >
                        View Credential →
                      </a>
                    )}
                  </div>
                  
                  <motion.button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {education.length === 0 && certifications.length === 0 && !showAddEducation && !showAddCertification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No education or certifications added yet</h4>
          <p className="text-gray-500">
            Add your educational background and professional certifications
          </p>
        </motion.div>
      )}
    </div>
  );
}
