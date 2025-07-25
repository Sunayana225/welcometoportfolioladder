'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Edit3 } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';
import ImageCropper from '../ImageCropper';

interface PersonalInfoFormProps {
  form: UseFormReturn<PortfolioData>;
}

function isValidSocialUrl(type: string, url: string): boolean {
  if (!url) return true;
  switch (type) {
    case 'github':
      return /^https?:\/\/github\.com\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)?\/?$/.test(url) && !url.endsWith('github.com/');
    case 'linkedin':
      return /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[A-Za-z0-9_-]+\/?$/.test(url);
    case 'twitter':
      return /^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/.test(url) && !url.endsWith('twitter.com/');
    case 'website':
      // Exclude common email/social domains
      const banned = [
        'linkedin.com', 'github.com', 'twitter.com', 'facebook.com', 'instagram.com', 'youtube.com',
        'gmail.com', 'outlook.com', 'mail.com', 'protonmail.com', 'yahoo.com', 'icloud.com', 'aol.com',
        'bitbucket.org', 'gitlab.com', 'medium.com', 'reddit.com', 'stackoverflow.com', 'behance.net',
        'dribbble.com', 't.me', 'wa.me'
      ];
      try {
        const u = new URL(url);
        return !banned.some(domain => u.hostname.includes(domain));
      } catch {
        return false;
      }
    default:
      return true;
  }
}

export default function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const socialLinks = watch('socialLinks') || {};
  const [socialErrors, setSocialErrors] = useState({ github: '', linkedin: '', twitter: '', website: '' });

  React.useEffect(() => {
    const newErrors: any = {};
    if (socialLinks.github && !isValidSocialUrl('github', socialLinks.github)) {
      newErrors.github = 'Enter a valid GitHub profile or repo URL (not just github.com)';
    }
    if (socialLinks.linkedin && !isValidSocialUrl('linkedin', socialLinks.linkedin)) {
      newErrors.linkedin = 'Enter a valid LinkedIn profile URL (linkedin.com/in/...)';
    }
    if (socialLinks.twitter && !isValidSocialUrl('twitter', socialLinks.twitter)) {
      newErrors.twitter = 'Enter a valid Twitter profile URL (twitter.com/username)';
    }
    if (socialLinks.website && !isValidSocialUrl('website', socialLinks.website)) {
      newErrors.website = 'Enter a valid personal website (not a social/email provider)';
    }
    setSocialErrors(newErrors);
  }, [socialLinks]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImageSrc(e.target?.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setValue('personalInfo.profileImage', croppedImageUrl);
    setShowCropper(false);
    setTempImageSrc('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc('');
  };

  const profileImage = watch('personalInfo.profileImage');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Let's start with your personal information
        </h3>
        <p className="text-gray-600">
          Tell us about yourself to create an amazing portfolio
        </p>
      </div>

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Upload Photo</span>
              </div>
            )}
          </motion.div>

          {/* Upload overlay */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Edit button for existing image */}
          {profileImage && (
            <motion.button
              onClick={() => {
                setTempImageSrc(profileImage);
                setShowCropper(true);
              }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          {profileImage ? 'Click the edit button to crop your image' : 'Upload a photo to get started'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Full Name *
          </label>
          <input
            {...register('personalInfo.fullName')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
            placeholder="John Doe"
          />
          {errors.personalInfo?.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.fullName.message}
            </p>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            {...register('personalInfo.title')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
            placeholder="Full Stack Developer"
          />
          {errors.personalInfo?.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.title.message}
            </p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Email Address *
          </label>
          <input
            {...register('personalInfo.email')}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
            placeholder="john@example.com"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.email.message}
            </p>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Phone Number *
          </label>
          <input
            {...register('personalInfo.phone')}
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
            placeholder="+1 (555) 123-4567"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Location *
          </label>
          <input
            {...register('personalInfo.location')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
            placeholder="New York, NY"
          />
          {errors.personalInfo?.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.location.message}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Bio *
        </label>
        <textarea
          {...register('personalInfo.bio')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none form-input"
          placeholder="Tell us about yourself, your experience, and what makes you unique..."
        />
        {errors.personalInfo?.bio && (
          <p className="mt-1 text-sm text-red-600">
            {errors.personalInfo.bio.message}
          </p>
        )}
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h4 className="text-lg font-medium text-gray-800 mb-4">Social Links (Optional)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <input
              {...register('socialLinks.github')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
              placeholder="https://github.com/username"
            />
            {socialErrors.github && (
              <p className="text-red-600 text-xs mt-1">{socialErrors.github}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              {...register('socialLinks.linkedin')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
              placeholder="https://linkedin.com/in/username"
            />
            {socialErrors.linkedin && (
              <p className="text-red-600 text-xs mt-1">{socialErrors.linkedin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              {...register('socialLinks.website')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
              placeholder="https://yourwebsite.com"
            />
            {socialErrors.website && (
              <p className="text-red-600 text-xs mt-1">{socialErrors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              {...register('socialLinks.twitter')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 form-input"
              placeholder="https://twitter.com/username"
            />
            {socialErrors.twitter && (
              <p className="text-red-600 text-xs mt-1">{socialErrors.twitter}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Image Cropper Modal */}
      {showCropper && tempImageSrc && (
        <ImageCropper
          src={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
          circularCrop={true}
        />
      )}
    </div>
  );
}
