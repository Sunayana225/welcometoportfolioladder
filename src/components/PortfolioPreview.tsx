'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, Github, Star, Calendar, Award, GraduationCap } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const { personalInfo, socialLinks, skills, projects, experience, education, certifications, theme } = data;

  const getThemeColors = () => {
    switch (theme) {
      case 'modern':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
        };
      case 'creative':
        return {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
          accent: '#45b7d1',
          background: '#f8f9fa',
          text: '#2c3e50',
          cardBackground: '#ffffff',
          divider: '#dee2e6',
          hover: '#e9ecef',
        };
      case 'professional':
        return {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db',
          background: '#ffffff',
          text: '#2c3e50',
          cardBackground: '#f8f9fa',
          divider: '#dee2e6',
          hover: '#e9ecef',
        };
      case 'dark':
        return {
          primary: '#bb86fc',
          secondary: '#03dac6',
          accent: '#cf6679',
          background: '#121212',
          text: '#ffffff',
          cardBackground: '#1e1e1e',
          divider: '#333333',
          hover: '#2a2a2a',
        };
      case 'pastel':
        return {
          primary: '#6B4F41', // Warm Brown
          secondary: '#FDF6EE', // Soft Cream
          accent: '#C4A484', // Warm Beige
          background: '#FDF6EE', // Soft Cream
          text: '#6B4F41', // Warm Brown
          cardBackground: '#F5EDE3', // Light Beige
          divider: '#E8D5C4', // Soft Beige
          hover: '#F2D3C2', // Light Rose Pink
          heartGradient: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 100%)', // Cream to Beige Gradient
        };
      default:
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
        };
    }
  };

  const colors = getThemeColors();
  const isDark = theme === 'dark';

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div 
      className="max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 px-8 py-16 text-center" style={{ color: colors.text }}>
          {personalInfo.profileImage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30 shadow-xl"
            >
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: colors.text,
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {personalInfo.fullName}
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-6"
            style={{
              color: colors.text,
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(255,255,255,0.7)'
            }}
          >
            {personalInfo.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg max-w-3xl mx-auto leading-relaxed"
            style={{
              color: colors.text,
              opacity: 0.8,
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            {personalInfo.bio}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
            style={{ color: colors.text, opacity: 0.9 }}
          >
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              {personalInfo.email}
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              {personalInfo.phone}
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {personalInfo.location}
            </div>
          </motion.div>
          
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-4 mt-6"
          >
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:opacity-80 transition-colors duration-200"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `2px solid ${colors.primary}40`
                }}
              >
                <Github className="w-5 h-5" style={{ color: colors.primary }} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:opacity-80 transition-colors duration-200"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `2px solid ${colors.primary}40`
                }}
              >
                <ExternalLink className="w-5 h-5" style={{ color: colors.primary }} />
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:opacity-80 transition-colors duration-200"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `2px solid ${colors.primary}40`
                }}
              >
                <ExternalLink className="w-5 h-5" style={{ color: colors.primary }} />
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>

      <div className="p-8 space-y-12">
        {/* Skills Section */}
        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              Skills & Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 hover:translate-x-1 transition-transform duration-300"
                  style={{ borderLeftColor: colors.primary }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{skill.name}</span>
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white font-semibold"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {skill.level}%
                    </span>
                  </div>
                  <div className={`w-full h-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      className="h-1 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.featured).concat(projects.filter(p => !p.featured)).slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{
                    backgroundColor: colors.cardBackground || (isDark ? '#1e1e1e' : '#ffffff'),
                    borderColor: colors.divider || (isDark ? '#333333' : '#e2e8f0')
                  }}
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.8 }}>
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${colors.primary}20`, 
                          color: colors.primary 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:underline"
                        style={{ color: colors.accent }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center text-sm hover:underline ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              Work Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="border-l-4 pl-6"
                  style={{ borderLeftColor: colors.accent }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold">{exp.position}</h4>
                    {exp.current && (
                      <span 
                        className="px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: colors.accent }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  
                  <h5 className="font-medium mb-2" style={{ color: colors.secondary }}>
                    {exp.company}
                  </h5>
                  
                  <div className={`flex items-center space-x-4 text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                    {exp.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                  
                  {exp.description && (
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {exp.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education & Certifications */}
        {(education.length > 0 || certifications.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
                  Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9 + index * 0.1 }}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBackground || (isDark ? '#1e1e1e' : '#f8fafc'),
                        borderColor: colors.divider || (isDark ? '#333333' : '#e2e8f0')
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className="w-5 h-5" style={{ color: colors.accent }} />
                        <h4 className="font-semibold">{edu.degree}</h4>
                      </div>
                      <h5 className="font-medium mb-2" style={{ color: colors.primary, opacity: 0.8 }}>
                        {edu.institution}
                      </h5>
                      <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                        {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
                  Certifications
                </h3>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 + index * 0.1 }}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBackground || (isDark ? '#1e1e1e' : '#f8fafc'),
                        borderColor: colors.divider || (isDark ? '#333333' : '#e2e8f0')
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="w-5 h-5" style={{ color: colors.accent }} />
                        <h4 className="font-semibold">{cert.name}</h4>
                      </div>
                      <h5 className="font-medium mb-2" style={{ color: colors.secondary }}>
                        {cert.issuer}
                      </h5>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Issued: {formatDate(cert.date)}
                        {cert.expiryDate && <span> • Expires: {formatDate(cert.expiryDate)}</span>}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline mt-2 inline-block"
                          style={{ color: colors.accent }}
                        >
                          View Credential →
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}
