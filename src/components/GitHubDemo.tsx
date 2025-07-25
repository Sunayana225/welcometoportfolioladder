'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Sparkles, ExternalLink, Star, Code } from 'lucide-react';

export default function GitHubDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const demoProjects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and Stripe integration for seamless online shopping experience.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind"],
      githubUrl: "https://github.com/username/ecommerce-platform",
      liveUrl: "https://demo-ecommerce.vercel.app",
      featured: true,
      stars: 45
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates, drag-and-drop interface, and team collaboration features.",
      technologies: ["Vue.js", "Firebase", "Vuetify", "PWA"],
      githubUrl: "https://github.com/username/task-manager",
      liveUrl: "https://task-manager-demo.netlify.app",
      featured: true,
      stars: 23
    },
    {
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and customizable widgets for weather tracking.",
      technologies: ["JavaScript", "Chart.js", "OpenWeather API", "CSS3"],
      githubUrl: "https://github.com/username/weather-dashboard",
      liveUrl: "https://weather-dash.github.io",
      featured: false,
      stars: 12
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Github className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">GitHub AI Integration Demo</h4>
            <p className="text-sm text-gray-600">
              See how Gemini AI analyzes repositories and generates descriptions
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowDemo(!showDemo)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showDemo ? 'Hide Demo' : 'Show Demo'}
        </motion.button>
      </div>

      {showDemo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              AI-Generated Projects from GitHub
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-gray-800 flex items-center">
                      {project.title}
                      {project.featured && (
                        <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
                      )}
                    </h6>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 mr-1" />
                      {project.stars}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      Code
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">How it works:</h5>
            <div className="text-sm text-yellow-700 space-y-1">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Enter your Gemini API key (free from Google AI Studio)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Provide a GitHub repository URL or username</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>AI analyzes the code, README, and repository metadata</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>Generates professional 150-character descriptions</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">5.</span>
                <span>Extracts technologies and identifies featured projects</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-medium text-green-800 mb-2">Benefits:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
              <div>✅ Saves hours of manual writing</div>
              <div>✅ Professional, consistent descriptions</div>
              <div>✅ Automatically extracts tech stacks</div>
              <div>✅ Identifies your best projects</div>
              <div>✅ Finds live demo URLs</div>
              <div>✅ Perfect 150-character limit</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
