import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationContext } from './NotificationProvider';
import { LoadingSpinner } from './LoadingSpinner';

interface ProviderFormData {
  serviceType: string;
  experience: number;
  hourlyRate: number;
  workingDays: number[];
  city: string;
  area: string;
  pincode: string;
  skills: string[];
  bio: string;
}

const SERVICE_TYPES = [
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'carpenter', label: 'Carpenter', icon: '🔨' },
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'car_washer', label: 'Car Washer', icon: '🚗' },
  { value: 'painter', label: 'Painter', icon: '🎨' },
  { value: 'cleaner', label: 'Cleaner', icon: '🧹' }
];

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' }
];

const COMMON_SKILLS = [
  'Emergency services',
  'Quality assurance',
  'Quick response',
  'Professional tools',
  'Warranty provided',
  'Licensed professional',
  'Insured work',
  '24/7 availability'
];

export function BecomeProviderPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotificationContext();
  
  const [formData, setFormData] = useState<ProviderFormData>({
    serviceType: '',
    experience: 1,
    hourlyRate: 300,
    workingDays: [1, 2, 3, 4, 5, 6],
    city: 'Mumbai',
    area: '',
    pincode: '',
    skills: [],
    bio: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showError('Please login to become a service provider');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, showError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleWorkingDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (formData.experience < 1) {
      newErrors.experience = 'Experience must be at least 1 year';
    }

    if (formData.hourlyRate < 100) {
      newErrors.hourlyRate = 'Hourly rate must be at least ₹100';
    }

    if (formData.workingDays.length === 0) {
      newErrors.workingDays = 'Please select at least one working day';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://wendor-backend-eta.vercel.app/api/service-providers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Service provider registration successful!');
        navigate('/');
      } else {
        showError(data.message || 'Registration failed');
      }
    } catch (error) {
      showError('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Become a Service Provider
            </h2>
            <p className="mt-2 text-gray-600">
              Join our network of professional service providers
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'serviceType', value: service.value } } as any)}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                      formData.serviceType === service.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{service.icon}</div>
                    <div className="text-sm font-medium">{service.label}</div>
                  </button>
                ))}
              </div>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
              )}
            </div>

            {/* Experience and Hourly Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience (Years) *
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.experience ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                )}
              </div>

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (₹) *
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Area *
                </label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={formData.area}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.area ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Andheri"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                )}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Pincode *
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pincode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="400001"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Working Days *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleWorkingDayToggle(day.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.workingDays.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.workingDays && (
                <p className="mt-1 text-sm text-red-600">{errors.workingDays}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skills & Specializations *
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.skills.includes(skill)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bio ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your experience, specializations, and what makes you a great service provider..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/500 characters (minimum 50 required)
              </p>
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registering...' : 'Register as Service Provider'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
