'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Code, Users, Globe, Wrench } from 'lucide-react';
import { PortfolioData, Skill } from '@/types/portfolio';

interface SkillsFormProps {
  form: UseFormReturn<PortfolioData>;
}

const skillCategories = [
  { id: 'technical', label: 'Technical Skills', icon: Code, color: 'bg-blue-100 text-blue-800' },
  { id: 'soft', label: 'Soft Skills', icon: Users, color: 'bg-green-100 text-green-800' },
  { id: 'language', label: 'Languages', icon: Globe, color: 'bg-purple-100 text-purple-800' },
  { id: 'tool', label: 'Tools & Software', icon: Wrench, color: 'bg-orange-100 text-orange-800' },
];

export default function SkillsForm({ form }: SkillsFormProps) {
  const { watch, setValue } = form;
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'technical' as const });
  
  const skills = watch('skills') || [];

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: newSkill.category,
      };
      
      setValue('skills', [...skills, skill]);
      setNewSkill({ name: '', level: 50, category: 'technical' });
    }
  };

  const removeSkill = (id: string) => {
    setValue('skills', skills.filter(skill => skill.id !== id));
  };

  const updateSkillLevel = (id: string, level: number) => {
    setValue('skills', skills.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    ));
  };

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Showcase Your Skills
        </h3>
        <p className="text-gray-600">
          Add your technical and soft skills to highlight your expertise
        </p>
      </div>

      {/* Add New Skill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
      >
        <h4 className="text-lg font-medium text-gray-800 mb-4">Add New Skill</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Skill name (e.g., React, JavaScript, Communication)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              {skillCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-600 w-12">
              {newSkill.level}%
            </span>
          </div>
        </div>
        
        <motion.button
          type="button"
          onClick={addSkill}
          disabled={!newSkill.name.trim()}
          className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </motion.button>
      </motion.div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {skillCategories.map(category => {
          const categorySkills = getSkillsByCategory(category.id);
          const Icon = category.icon;
          
          if (categorySkills.length === 0) return null;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${category.color} mr-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">
                  {category.label} ({categorySkills.length})
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {categorySkills.map(skill => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-800">{skill.name}</h5>
                        <motion.button
                          type="button"
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Proficiency</span>
                          <span className="text-sm font-medium text-gray-800">
                            {skill.level}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                          className="w-full mt-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No skills added yet</h4>
          <p className="text-gray-500">
            Start by adding your first skill above to showcase your expertise
          </p>
        </motion.div>
      )}
    </div>
  );
}
