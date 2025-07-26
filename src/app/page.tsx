'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Eye, Wand2, AlertCircle, Menu, X } from 'lucide-react';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import { PortfolioData } from '@/types/portfolio';
import { exportPortfolio } from '@/lib/exportPortfolio';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

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
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setShowPreview(false);
    setIsEditMode(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
    setIsEditMode(false);
  };

  const handleExport = async () => {
    if (!portfolioData) {
      alert('No portfolio data available. Please fill out the form first.');
      return;
    }

    // Validate before export
    const errors = validatePortfolioData(portfolioData);

    if (errors.length > 0) {
      alert(`Please complete all required fields:\n\n• ${errors.join('\n• ')}`);
      return;
    }

    try {
      await exportPortfolio(portfolioData);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export portfolio. Please try again.');
    }
  };



  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 50%, #C4A484 100%)' }}>
      {/* Smart Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl shadow-lg">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Portfolio Maker</h1>
                <p className="text-xs text-gray-600">Create • Design • Export</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              <button onClick={() => scrollToSection('home')} className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="font-medium">Home</span>
              </button>
              <button onClick={() => scrollToSection('features')} className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="font-medium">Features</span>
              </button>
              <button onClick={() => scrollToSection('templates')} className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="font-medium">Templates</span>
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="font-medium">How It Works</span>
              </button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => scrollToSection('builder')}
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Building</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('templates')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
                Templates
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('builder')}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Building</span>
              </button>
            </div>
          </motion.div>
        )}
      </nav>



      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/30" />



        <div className="relative z-10 container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Main Title with Creative Layout */}
            <div className="relative mb-8">
              <div className="text-center mb-6">
                <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Portfolio{" "}
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    Maker
                  </span>
                </h1>
              </div>

              {/* Subtitle with Clean Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="space-y-4"
              >
                <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-4xl mx-auto text-gray-800">
                  Create a <span className="font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">stunning portfolio</span> website in minutes.
                </p>
                <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
                  No coding required • Professional themes • Export ready
                </p>
              </motion.div>
            </div>
            {/* Action Buttons with Creative Layout */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Edit Mode Indicator */}
              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border border-green-300 rounded-xl p-4 mb-6 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <span className="text-lg">✅</span>
                    <span className="font-semibold">Edit Mode Active</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Your changes are automatically saved. Click "Preview Portfolio" to see your updates!
                  </p>
                </motion.div>
              )}

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={handlePreview}
                  disabled={!portfolioData}
                  className="group relative overflow-hidden px-8 py-4 bg-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500"
                  style={{ color: '#3D2914' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-lg">Preview Portfolio</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleExport}
                  disabled={!portfolioData || validationErrors.length > 0}
                  className={`group relative overflow-hidden px-8 py-4 border-2 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-500 ${
                    validationErrors.length > 0
                      ? 'bg-red-500 border-red-500 text-white cursor-not-allowed'
                      : 'bg-transparent border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={{ scale: validationErrors.length === 0 ? 1.05 : 1, y: validationErrors.length === 0 ? -2 : 0 }}
                  whileTap={{ scale: validationErrors.length === 0 ? 0.98 : 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-3">
                    {validationErrors.length > 0 ? (
                      <>
                        <div className="p-2 bg-red-600 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg">Complete Required Fields ({validationErrors.length})</span>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-300">
                          <Download className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                        </div>
                        <span className="text-lg">Export Website</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                color: '#3D2914',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              Why Choose Portfolio Maker?
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{
                color: '#4A3429',
                textShadow: '1px 1px 3px rgba(255,255,255,0.7)'
              }}
            >
              Create professional portfolios with ease using our powerful features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🚀",
                title: "Lightning Fast",
                description: "Create your portfolio in minutes, not hours. Our streamlined process gets you online quickly."
              },
              {
                icon: "🎨",
                title: "Beautiful Themes",
                description: "Choose from professionally designed themes that make your work shine and impress visitors."
              },
              {
                icon: "📱",
                title: "Mobile Ready",
                description: "Your portfolio looks perfect on all devices. Responsive design ensures great user experience."
              },
              {
                icon: "⚡",
                title: "No Code Required",
                description: "Focus on your content, not coding. Our intuitive interface handles all the technical details."
              },
              {
                icon: "🔧",
                title: "Easy Customization",
                description: "Personalize every aspect of your portfolio to match your unique style and brand."
              },
              {
                icon: "💾",
                title: "Export Ready",
                description: "Download your complete portfolio as static files, ready to deploy anywhere you want."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{
                    color: '#3D2914',
                    textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    color: '#4A3429',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                color: '#3D2914',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              How It Works
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{
                color: '#4A3429',
                textShadow: '1px 1px 3px rgba(255,255,255,0.7)'
              }}
            >
              Three simple steps to create your professional portfolio
            </p>
          </motion.div>

          {/* Step Indicator with Connecting Lines */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
              <div className="flex justify-between items-center">
                <div className="w-1/3 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
                <div className="w-1/3 h-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50"></div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Fill Your Details",
                  description: "Add your personal information, skills, projects, and experience through our easy-to-use form."
                },
                {
                  step: "02",
                  title: "Choose a Theme",
                  description: "Select from our collection of professional themes that best represents your style and industry."
                },
                {
                  step: "03",
                  title: "Export & Deploy",
                  description: "Download your complete portfolio and deploy it to your favorite hosting platform in minutes."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative z-10"
                >
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-20">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{
                      color: '#3D2914',
                      textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: '#4A3429',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                color: '#3D2914',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              Beautiful Templates
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{
                color: '#4A3429',
                textShadow: '1px 1px 3px rgba(255,255,255,0.7)'
              }}
            >
              Choose from our collection of professionally designed portfolio templates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Modern",
                description: "Clean and contemporary design perfect for developers and designers",
                color: "from-blue-500 to-cyan-500",
                features: ["Dark/Light Mode", "Animated Sections", "Project Gallery"]
              },
              {
                name: "Creative",
                description: "Bold and artistic layout ideal for creative professionals",
                color: "from-purple-500 to-pink-500",
                features: ["Custom Animations", "Portfolio Grid", "Contact Form"]
              },
              {
                name: "Professional",
                description: "Elegant and sophisticated design for business professionals",
                color: "from-green-500 to-teal-500",
                features: ["Timeline View", "Skills Chart", "Testimonials"]
              }
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className={`w-full h-40 bg-gradient-to-br ${template.color} rounded-xl mb-6 flex items-center justify-center`}>
                  <div className="text-white text-lg font-semibold">{template.name} Theme</div>
                </div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: '#3D2914',
                    textShadow: '1px 1px 3px rgba(255,255,255,0.7)'
                  }}
                >
                  {template.name}
                </h3>
                <p
                  className="mb-6 leading-relaxed"
                  style={{
                    color: '#4A3429',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {template.description}
                </p>
                <div className="space-y-2">
                  {template.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span
                        className="text-sm"
                        style={{
                          color: '#4A3429',
                          textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative" id="builder">
        {!showPreview ? (
          <div className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              {/* Section Header */}
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                >
                  {isEditMode ? '✏️ Edit Your Portfolio' : "Let's Build Your Portfolio"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-white/80 max-w-2xl mx-auto"
                >
                  {isEditMode
                    ? 'Make changes to your portfolio and see them reflected in real-time'
                    : 'Follow the guided steps to create a professional portfolio that showcases your skills and achievements'
                  }
                </motion.p>
              </div>

              <PortfolioForm
                onDataChange={handleDataChange}
                initialData={isEditMode && portfolioData ? portfolioData : undefined}
              />
            </motion.div>
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Preview Header */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfolio Preview</h2>
                    <p className="text-gray-600">See how your portfolio will look to visitors</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>✏️ Edit Portfolio</span>
                    </motion.button>
                    <motion.button
                      onClick={handleBackToForm}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>← Back to Form</span>
                    </motion.button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {portfolioData && <PortfolioPreview data={portfolioData} />}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {!showPreview && (
        <footer className="relative bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              {/* Footer Content */}
              <div className="flex flex-col items-center space-y-6">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Portfolio Maker</span>
                </div>

                {/* Description */}
                <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                  Empowering developers and creators to build stunning portfolios without the complexity
                </p>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No Coding Required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Professional Themes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Export Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Mobile Responsive</span>
                  </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 border-t border-white/10 w-full">
                  <p className="text-white/60 text-sm">
                    Built with <span className="text-red-400 mx-1">❤️</span> using Next.js, React, and Tailwind CSS
                  </p>
                  <p className="text-white/50 text-xs mt-2">
                    © 2024 Portfolio Maker. Create stunning portfolios effortlessly.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      )}
    </div>
  );
}
