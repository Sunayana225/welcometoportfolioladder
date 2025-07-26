'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Award, Code, Palette } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';
import PersonalInfoForm from './forms/PersonalInfoForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import CertificationsForm from './forms/CertificationsForm';
import ThemeSelector from './ThemeSelector';

const portfolioSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    title: z.string().min(1, 'Title is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    location: z.string().min(1, 'Location is required'),
    profileImage: z.string().optional(),
    formspreeId: z.string().optional(),
  }),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().min(1).max(100),
    category: z.enum(['technical', 'soft', 'language', 'tool']),
  })),
  projects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    liveUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().optional(),
    featured: z.boolean(),
  })),
  experience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string(),
    location: z.string(),
  })),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean(),
    gpa: z.string().optional(),
    description: z.string().optional(),
  })),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuing organization is required'),
    date: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().optional(),
    credentialUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  })),
  theme: z.string(),
});

interface PortfolioFormProps {
  onDataChange: (data: PortfolioData) => void;
  initialData?: Partial<PortfolioData>;
}

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'skills', title: 'Skills', icon: Code },
  { id: 'projects', title: 'Projects', icon: Briefcase },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'certifications', title: 'Certifications', icon: Award },
  { id: 'theme', title: 'Theme', icon: Palette },
];

export default function PortfolioForm({ onDataChange, initialData }: PortfolioFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<PortfolioData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        profileImage: '',
        formspreeId: '',
      },
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        website: '',
        instagram: '',
      },
      skills: [],
      projects: [],
      experience: [],
      education: [],
      certifications: [],
      theme: 'modern',
      ...initialData,
    },
    mode: 'onChange',
  });

  const { watch, handleSubmit } = form;
  const watchedData = watch();

  // Use a ref to track previous data to prevent unnecessary updates
  const prevDataRef = React.useRef<string>('');

  React.useEffect(() => {
    const currentDataString = JSON.stringify(watchedData);
    if (currentDataString !== prevDataRef.current) {
      prevDataRef.current = currentDataString;
      onDataChange(watchedData);
    }
  }, [watchedData, onDataChange]);

  // Function to check if a step is completed
  const isStepCompleted = (stepId: string): boolean => {
    switch (stepId) {
      // API key step removed for testing
      // case 'apikey':
      //   return isApiKeyValidated;
      case 'resume':
        return true; // Resume step is always considered completed (can be skipped)
      case 'personal':
        return !!(watchedData.personalInfo?.fullName &&
                 watchedData.personalInfo?.title &&
                 watchedData.personalInfo?.bio &&
                 watchedData.personalInfo?.email);
      case 'skills':
        return watchedData.skills && watchedData.skills.length > 0;
      case 'projects':
        return watchedData.projects && watchedData.projects.length > 0;
      case 'experience':
        return watchedData.experience && watchedData.experience.length > 0;
      case 'education':
        return watchedData.education && watchedData.education.length > 0;
      case 'certifications':
        return true; // Certifications are optional
      case 'theme':
        return !!watchedData.theme;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = (data: PortfolioData) => {
    // Form submission logic can be added here if needed
    console.log('Form submitted:', data);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };



  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return <PersonalInfoForm form={form} />;
      case 'skills':
        return <SkillsForm form={form} />;
      case 'projects':
        return <ProjectsForm form={form} />;
      case 'experience':
        return <ExperienceForm form={form} />;
      case 'education':
        return <EducationForm form={form} />;
      case 'certifications':
        return <CertificationsForm form={form} />;
      case 'theme':
        return <ThemeSelector form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Step Indicator - Redesigned */}
      <div className="mb-12">
        {/* Progress Bar Background */}
        <div className="relative mb-8">
          <div className="absolute top-6 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Step Circles */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isStepValid = isStepCompleted(step.id);

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <motion.div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-white border-white shadow-xl scale-110'
                        : isCompleted && isStepValid
                        ? 'bg-green-500 border-green-500 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-orange-400 border-orange-400 text-white shadow-lg'
                        : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={isActive ? { color: '#6B4F41' } : {}}
                    onClick={() => setCurrentStep(index)}
                  >
                    <Icon size={20} />

                    {/* Active Step Glow */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p className={`text-xs font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}>
                      {step.title}
                    </p>
                    {isCompleted && isStepValid && (
                      <div className="text-green-400 text-xs mt-1">✓ Complete</div>
                    )}
                    {isCompleted && !isStepValid && (
                      <div className="text-orange-400 text-xs mt-1">⚠️ Incomplete</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/80 text-lg">
            Step {currentStep + 1} of {steps.length} • Complete this section to continue
          </p>
        </motion.div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        {/* Content Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                {React.createElement(steps[currentStep].icon, { size: 24, className: "text-white" })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{steps[currentStep].title}</h3>
                <p className="text-white/80 text-sm">Fill in your information below</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8">
            {renderStepContent()}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <motion.button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="group flex items-center space-x-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: currentStep === 0 ? 1 : 1.05, x: currentStep === 0 ? 0 : -2 }}
          whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Previous</span>
        </motion.button>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-3">
          <div className="text-white/60 text-sm font-medium">
            {currentStep + 1} of {steps.length}
          </div>
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-white scale-125'
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.button
          type="button"
          onClick={currentStep === steps.length - 1 ? handleSubmit(onSubmit) : nextStep}
          className="group flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-xl hover:bg-white/90 transition-all duration-300 font-medium"
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{currentStep === steps.length - 1 ? 'Generate Portfolio' : 'Next'}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>
      </motion.div>
    </div>
  );
};