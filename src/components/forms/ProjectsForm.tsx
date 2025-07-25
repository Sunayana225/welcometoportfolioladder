'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ExternalLink, Github, Star, Image as ImageIcon } from 'lucide-react';
import { PortfolioData, Project } from '@/types/portfolio';
import GitHubIntegration from '@/components/GitHubIntegration';
import GitHubDemo from '@/components/GitHubDemo';
import { ProjectSuggestion } from '@/lib/githubService';

interface ProjectsFormProps {
  form: UseFormReturn<PortfolioData>;
  huggingfaceApiKey?: string;
  isApiKeyValidated?: boolean;
}

export default function ProjectsForm({ form, huggingfaceApiKey = '', isApiKeyValidated = false }: ProjectsFormProps) {
  const { watch, setValue } = form;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false,
  });
  
  const projects = watch('projects') || [];

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
        liveUrl: newProject.liveUrl.trim() || undefined,
        githubUrl: newProject.githubUrl.trim() || undefined,
        imageUrl: newProject.imageUrl.trim() || undefined,
        featured: newProject.featured,
      };
      
      setValue('projects', [...projects, project]);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        imageUrl: '',
        featured: false,
      });
      setShowAddForm(false);
    }
  };

  const removeProject = (id: string) => {
    setValue('projects', projects.filter(project => project.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setValue('projects', projects.map(project => 
      project.id === id ? { ...project, featured: !project.featured } : project
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProject({ ...newProject, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectsGenerated = (suggestions: ProjectSuggestion[]) => {
    const newProjects: Project[] = suggestions.map(suggestion => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: suggestion.title,
      description: suggestion.description,
      technologies: suggestion.technologies,
      liveUrl: suggestion.liveUrl,
      githubUrl: suggestion.githubUrl,
      imageUrl: undefined,
      featured: suggestion.featured,
    }));

    setValue('projects', [...projects, ...newProjects]);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Showcase Your Projects
        </h3>
        <p className="text-gray-600">
          Add your best projects to demonstrate your skills and experience
        </p>
      </div>

      {/* GitHub Demo */}
      <GitHubDemo />

      {/* GitHub Integration */}
      <GitHubIntegration
        onProjectsGenerated={handleProjectsGenerated}
        huggingfaceApiKey={huggingfaceApiKey}
        isApiKeyValidated={isApiKeyValidated}
      />

      {/* Add Project Button */}
      {!showAddForm && (
        <motion.button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
          <span className="text-gray-600 group-hover:text-purple-600 font-medium">
            Add New Project
          </span>
        </motion.button>
      )}

      {/* Add Project Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
          >
            <h4 className="text-lg font-medium text-gray-800 mb-4">Add New Project</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="My Awesome Project"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  placeholder="Describe your project, its features, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://myproject.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image (optional)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="project-image"
                  />
                  <label
                    htmlFor="project-image"
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Image
                  </label>
                  {newProject.imageUrl && (
                    <img
                      src={newProject.imageUrl}
                      alt="Project preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mark as featured project
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <motion.button
                type="button"
                onClick={addProject}
                disabled={!newProject.title.trim() || !newProject.description.trim()}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => setShowAddForm(false)}
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

      {/* Projects List */}
      <div className="space-y-4">
        <AnimatePresence>
          {projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-medium text-gray-800">{project.title}</h4>
                    {project.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
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
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    type="button"
                    onClick={() => toggleFeatured(project.id)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      project.featured
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && !showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No projects added yet</h4>
          <p className="text-gray-500">
            Start by adding your first project to showcase your work
          </p>
        </motion.div>
      )}
    </div>
  );
}
