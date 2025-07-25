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
import ResumeUpload from './ResumeUpload';
import ApiKeyValidation from './ApiKeyValidation';

const portfolioSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    title: z.string().min(1, 'Title is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    location: z.string().min(1, 'Location is required'),
    profileImage: z.string().optional(),
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
  // API key validation temporarily disabled for testing
  // { id: 'apikey', title: 'API Setup', icon: User },
  { id: 'resume', title: 'Quick Start', icon: User },
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
  // API key validation temporarily disabled for testing
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useState('test-key-disabled');
  const [isApiKeyValidated, setIsApiKeyValidated] = useState(true); // Always validated for testing
  
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

  const { watch, handleSubmit, formState: { errors } } = form;
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
    // API key validation temporarily disabled for testing
    // if (currentStep === 0 && !isApiKeyValidated) {
    //   alert('Please validate your Hugging Face API key before proceeding.');
    //   return;
    // }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleApiKeyValidated = (validatedKey: string) => {
    setHuggingfaceApiKey(validatedKey);
    setIsApiKeyValidated(true);
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

  const handleResumeDataExtracted = (resumeData: any) => {
    // Update form with extracted resume data
    form.reset({
      personalInfo: {
        fullName: resumeData.name || '',
        title: resumeData.title || '',
        bio: resumeData.about || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        location: resumeData.location || '',
        profileImage: '',
      },
      socialLinks: {
        github: resumeData.github || '',
        linkedin: resumeData.linkedin || '',
        twitter: '',
        website: resumeData.website || '',
        instagram: '',
      },
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      certifications: resumeData.certifications || [],
      theme: resumeData.theme || 'pastel',
    });

    // Move to next step
    setCurrentStep(1);
  };

  const handleSkipResume = () => {
    // Skip resume upload and go directly to personal info form
    nextStep();
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      // API key validation step temporarily disabled for testing
      // case 'apikey':
      //   return (
      //     <ApiKeyValidation
      //       onValidationSuccess={handleApiKeyValidated}
      //       initialApiKey={huggingfaceApiKey}
      //     />
      //   );
      case 'resume':
        return (
          <ResumeUpload
            onDataExtracted={handleResumeDataExtracted}
            huggingfaceApiKey={huggingfaceApiKey}
            onSkip={handleSkipResume}
          />
        );
      case 'personal':
        return <PersonalInfoForm form={form} />;
      case 'skills':
        return <SkillsForm form={form} />;
      case 'projects':
        return <ProjectsForm form={form} huggingfaceApiKey={huggingfaceApiKey} isApiKeyValidated={isApiKeyValidated} />;
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isStepValid = isStepCompleted(step.id);

            return (
              <div key={step.id} className="flex items-center">
                <div className="relative group">
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-white border-white shadow-lg'
                        : isCompleted && isStepValid
                        ? 'bg-green-500 border-green-500 text-white shadow-md'
                        : isCompleted
                        ? 'bg-orange-400 border-orange-400 text-white shadow-md'
                        : 'bg-white/20 border-white/30 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={isActive ? { color: '#6B4F41' } : {}}
                  >
                    <Icon size={20} />
                  </motion.div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {step.title}
                    {isCompleted && isStepValid && ' ✓'}
                    {isCompleted && !isStepValid && ' ⚠️'}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    isCompleted && isStepValid ? 'bg-green-400' : isCompleted ? 'bg-orange-300' : 'bg-white/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/80">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="glass-effect rounded-2xl p-8 mb-8"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <motion.button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            currentStep === 0
              ? 'bg-white/20 text-white/50 cursor-not-allowed'
              : 'bg-white/30 text-white hover:bg-white/40 hover:scale-105'
          }`}
          whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
          whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
        >
          Previous
        </motion.button>

        <motion.button
          type="button"
          onClick={currentStep === steps.length - 1 ? handleSubmit(onSubmit) : nextStep}
          className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStep === steps.length - 1 ? 'Generate Portfolio' : 'Next'}
        </motion.button>
      </div>
    </div>
  );
};