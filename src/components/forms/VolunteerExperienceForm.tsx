'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Trash2, Users, Calendar, MapPin, Building } from 'lucide-react';
import { PortfolioData, VolunteerExperience } from '@/types/portfolio';

interface VolunteerExperienceFormProps {
  form: UseFormReturn<PortfolioData>;
}

export default function VolunteerExperienceForm({ form }: VolunteerExperienceFormProps) {
  const { register, watch, setValue } = form;
  const volunteerExperience = watch('volunteerExperience') || [];

  const addVolunteerExperience = () => {
    const newExperience: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
      type: 'volunteer',
    };
    setValue('volunteerExperience', [...volunteerExperience, newExperience]);
  };

  const removeVolunteerExperience = (id: string) => {
    setValue('volunteerExperience', volunteerExperience.filter(exp => exp.id !== id));
  };

  const updateVolunteerExperience = (id: string, field: keyof VolunteerExperience, value: any) => {
    const updated = volunteerExperience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setValue('volunteerExperience', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Users className="w-8 h-8 text-purple-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Volunteer & Club Experience</h3>
        <p className="text-gray-600">
          Showcase your volunteer work, club memberships, and community involvement (Optional)
        </p>
      </div>

      {volunteerExperience.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No volunteer experience added yet</h4>
          <p className="text-gray-500 mb-6">Add your volunteer work, club activities, or community involvement</p>
          <motion.button
            onClick={addVolunteerExperience}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Volunteer Experience
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {volunteerExperience.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Volunteer Experience #{index + 1}
                </h4>
                <motion.button
                  onClick={() => removeVolunteerExperience(experience.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline w-4 h-4 mr-2" />
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={experience.organization}
                    onChange={(e) => updateVolunteerExperience(experience.id, 'organization', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Red Cross, Local Food Bank, etc."
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    value={experience.role}
                    onChange={(e) => updateVolunteerExperience(experience.id, 'role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Volunteer Coordinator, Club President, etc."
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={experience.type}
                    onChange={(e) => updateVolunteerExperience(experience.id, 'type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="volunteer">Volunteer Work</option>
                    <option value="club">Club/Society</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={experience.location}
                    onChange={(e) => updateVolunteerExperience(experience.id, 'location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateVolunteerExperience(experience.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="space-y-2">
                    <input
                      type="month"
                      value={experience.endDate || ''}
                      onChange={(e) => updateVolunteerExperience(experience.id, 'endDate', e.target.value)}
                      disabled={experience.current}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={experience.current}
                        onChange={(e) => {
                          updateVolunteerExperience(experience.id, 'current', e.target.checked);
                          if (e.target.checked) {
                            updateVolunteerExperience(experience.id, 'endDate', '');
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Currently active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={experience.description}
                  onChange={(e) => updateVolunteerExperience(experience.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your role, responsibilities, and achievements..."
                />
              </div>
            </motion.div>
          ))}

          <motion.button
            onClick={addVolunteerExperience}
            className="w-full py-4 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Volunteer Experience
          </motion.button>
        </div>
      )}
    </div>
  );
}
