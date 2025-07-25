'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Eye, Wand2, AlertCircle } from 'lucide-react';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import { PortfolioData } from '@/types/portfolio';
import { exportPortfolio } from '@/lib/exportPortfolio';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validatePortfolioData = (data: PortfolioData | null): string[] => {
    const errors: string[] = [];

    if (!data) {
      errors.push('Portfolio data is missing');
      return errors;
    }

    // Only require the most essential fields for testing
    if (!data.personalInfo?.fullName?.trim()) {
      errors.push('Full name is required');
    }
    if (!data.personalInfo?.title?.trim()) {
      errors.push('Professional title is required');
    }

    // Make other fields optional for testing
    // if (!data.personalInfo?.bio?.trim()) {
    //   errors.push('Bio/summary is required');
    // }
    // if (!data.personalInfo?.email?.trim()) {
    //   errors.push('Email address is required');
    // }
    // if (!data.personalInfo?.phone?.trim()) {
    //   errors.push('Phone number is required');
    // }
    // if (!data.personalInfo?.location?.trim()) {
    //   errors.push('Location is required');
    // }

    // // At least one social link
    // const socialLinks = data.socialLinks;
    // const hasSocialLink = socialLinks?.github || socialLinks?.linkedin || socialLinks?.website || socialLinks?.twitter;
    // if (!hasSocialLink) {
    //   errors.push('At least one social link (GitHub, LinkedIn, or Website) is required');
    // }

    // // At least 3 skills
    // if (!data.skills || data.skills.length < 3) {
    //   errors.push('At least 3 skills are required');
    // }

    // // At least 1 project
    // if (!data.projects || data.projects.length < 1) {
    //   errors.push('At least 1 project is required');
    // }

    // // At least 1 experience or education
    // const hasExperience = data.experience && data.experience.length > 0;
    // const hasEducation = data.education && data.education.length > 0;
    // if (!hasExperience && !hasEducation) {
    //   errors.push('At least one work experience or education entry is required');
    // }

    // Validate certifications if any exist (disabled for testing)
    // if (data.certifications && data.certifications.length > 0) {
    //   data.certifications.forEach((cert, index) => {
    //     if (!cert.name?.trim()) {
    //       errors.push(`Certification ${index + 1}: Name is required`);
    //     }
    //     if (!cert.issuer?.trim()) {
    //       errors.push(`Certification ${index + 1}: Issuing organization is required`);
    //     }
    //     if (!cert.date?.trim()) {
    //       errors.push(`Certification ${index + 1}: Issue date is required`);
    //     }
    //     if (!cert.credentialUrl?.trim()) {
    //       errors.push(`Certification ${index + 1}: Credential URL is required`);
    //     }
    //   });
    // }

    return errors;
  };

  const handleDataChange = useCallback((data: PortfolioData) => {
    setPortfolioData(data);
    const errors = validatePortfolioData(data);
    setValidationErrors(errors);
  }, []);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExport = async () => {
    if (!portfolioData) {
      alert('No portfolio data available. Please fill out the form first.');
      return;
    }

    console.log('Portfolio data:', portfolioData);

    // Validate before export
    const errors = validatePortfolioData(portfolioData);
    console.log('Validation errors:', errors);

    if (errors.length > 0) {
      alert(`Please complete all required fields:\n\n• ${errors.join('\n• ')}`);
      return;
    }

    try {
      console.log('Starting export...');
      await exportPortfolio(portfolioData);
      console.log('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export portfolio. Please try again.');
    }
  };

  // Test function with minimal data
  const handleTestExport = async () => {
    const testData: PortfolioData = {
      personalInfo: {
        fullName: 'John Doe',
        title: 'Software Developer',
        bio: 'A passionate developer',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, USA',
        profileImage: '',
      },
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: '',
        website: '',
        instagram: '',
      },
      skills: [
        { id: '1', name: 'JavaScript', level: 90, category: 'technical' },
        { id: '2', name: 'React', level: 85, category: 'technical' },
        { id: '3', name: 'Node.js', level: 80, category: 'technical' },
      ],
      projects: [
        {
          id: '1',
          title: 'Test Project',
          description: 'A test project',
          technologies: ['React', 'JavaScript'],
          githubUrl: 'https://github.com/johndoe/test',
          liveUrl: '',
          imageUrl: '',
          featured: true,
        },
      ],
      experience: [
        {
          id: '1',
          position: 'Developer',
          company: 'Test Company',
          startDate: '2023-01-01',
          endDate: '',
          current: true,
          description: 'Working as a developer',
          location: 'Remote',
        },
      ],
      education: [],
      certifications: [],
      theme: 'modern',
    };

    try {
      console.log('Starting test export...');
      await exportPortfolio(testData);
      console.log('Test export completed successfully!');
    } catch (error) {
      console.error('Test export failed:', error);
      alert('Test export failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 100%)' }}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Wand2 className="w-8 h-8 text-white" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Portfolio Maker
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Create a stunning portfolio website in minutes. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handlePreview}
                disabled={!portfolioData}
                className="flex items-center px-6 py-3 bg-white rounded-lg font-medium hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-all duration-300"
                style={{ color: '#3D2914' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview Portfolio
              </motion.button>
              <motion.button
                onClick={handleExport}
                disabled={!portfolioData || validationErrors.length > 0}
                className={`flex items-center px-6 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
                  validationErrors.length > 0
                    ? 'bg-red-500 border-red-500 text-white cursor-not-allowed'
                    : 'bg-transparent border-white text-white hover:bg-white hover:text-[#3D2914]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#6B4F41';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
                whileHover={{ scale: validationErrors.length === 0 ? 1.05 : 1 }}
                whileTap={{ scale: validationErrors.length === 0 ? 0.95 : 1 }}
              >
                {validationErrors.length > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Complete Required Fields ({validationErrors.length})
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Export Website
                  </>
                )}
              </motion.button>

              {/* Test Export Button */}
              <motion.button
                onClick={handleTestExport}
                className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🧪 Test Export
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {!showPreview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PortfolioForm onDataChange={handleDataChange} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Portfolio Preview</h2>
              <motion.button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Editor
              </motion.button>
            </div>
            {portfolioData && <PortfolioPreview data={portfolioData} />}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white/80">
            <p className="mb-4">
              Built with ❤️ using Next.js, React, and Tailwind CSS
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-200">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Templates
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
